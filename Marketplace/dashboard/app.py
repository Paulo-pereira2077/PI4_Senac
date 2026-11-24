import streamlit as st
import pandas as pd
import plotly.express as px
import requests

API_BASE_URL = "http://localhost:3000"

st.set_page_config(page_title="Dashboard do Vendedor", layout="wide")
st.title("Painel Administrativo - Métricas de Vendas")


def formatar_brl(valor: float) -> str:
    return f"R$ {valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


# 1. Troca silenciosa do código temporário pelo JWT (sem expor o token na URL)
code_url = st.query_params.get("code", "")
if code_url:
    try:
        resp_code = requests.post(
            f"{API_BASE_URL}/api/dashboard/trocar-codigo",
            json={"codigo": code_url},
            timeout=10,
        )
        if resp_code.status_code == 200:
            st.session_state["token"] = resp_code.json().get("token", "")
        st.query_params.clear()
    except requests.exceptions.RequestException as e:
        st.error(f"Erro ao autenticar sessão do vendedor: {e}")

token = st.session_state.get("token", "")

if not token:
    st.warning("Sessão não identificada. Abra o dashboard diretamente pelo aplicativo logado como vendedor.")
    st.stop()

# 2. Consulta automática dos dados completos do vendedor logado
headers = {"Authorization": f"Bearer {token}"}
try:
    resp = requests.get(
        f"{API_BASE_URL}/api/dashboard/exportar?formato=json&completo=true",
        headers=headers,
        timeout=10,
    )
    if resp.status_code != 200:
        st.error(f"Erro ao carregar dados ({resp.status_code}): {resp.text}")
        st.stop()
    payload = resp.json()
except requests.exceptions.RequestException as e:
    st.error(f"Não foi possível conectar ao servidor: {e}")
    st.stop()

if isinstance(payload, dict):
    vendas_raw = payload.get("vendas", [])
    estoque_raw = payload.get("estoque", [])
    avaliacoes_raw = payload.get("avaliacoes", [])
else:
    vendas_raw = payload
    estoque_raw = []
    avaliacoes_raw = []

df_vendas = pd.DataFrame(vendas_raw)
df_estoque = pd.DataFrame(estoque_raw)
df_avaliacoes = pd.DataFrame(avaliacoes_raw)

if not df_vendas.empty:
    df_vendas["data_pedido"] = pd.to_datetime(df_vendas["data_pedido"], errors="coerce")
    if "categoria" not in df_vendas.columns:
        df_vendas["categoria"] = "Eletrônicos"
    if "uso_cupom" not in df_vendas.columns:
        df_vendas["uso_cupom"] = df_vendas["metodo_pagamento"].apply(
            lambda x: "Com Cupom" if "cupom" in str(x).lower() else "Sem Cupom"
        )

if not df_avaliacoes.empty and "data_avaliacao" in df_avaliacoes.columns:
    df_avaliacoes["data_avaliacao"] = pd.to_datetime(df_avaliacoes["data_avaliacao"], errors="coerce")

# 3. Filtros laterais (aplicados às vendas)
st.sidebar.header("Filtros de Vendas")

if not df_vendas.empty:
    datas_validas = df_vendas["data_pedido"].dropna()
    if not datas_validas.empty:
        data_min = datas_validas.min().date()
        data_max = datas_validas.max().date()
        periodo = st.sidebar.date_input(
            "Período",
            value=(data_min, data_max),
            min_value=data_min,
            max_value=data_max,
        )
    else:
        periodo = None

    categorias_unicas = sorted(df_vendas["categoria"].dropna().unique().tolist())
    categorias_sel = st.sidebar.multiselect(
        "Categoria",
        options=categorias_unicas,
        default=categorias_unicas,
    )

    produtos_unicos = sorted(df_vendas["produto"].dropna().unique().tolist())
    produtos_sel = st.sidebar.multiselect(
        "Produto",
        options=produtos_unicos,
        default=produtos_unicos,
    )

    status_unicos = sorted(df_vendas["status"].dropna().unique().tolist())
    status_sel = st.sidebar.multiselect(
        "Status do Pedido",
        options=status_unicos,
        default=status_unicos,
    )

    df_filtrado = df_vendas[
        df_vendas["categoria"].isin(categorias_sel)
        & df_vendas["produto"].isin(produtos_sel)
        & df_vendas["status"].isin(status_sel)
    ]

    if periodo and isinstance(periodo, tuple) and len(periodo) == 2:
        inicio, fim = periodo
        df_filtrado = df_filtrado[
            (df_filtrado["data_pedido"].dt.date >= inicio)
            & (df_filtrado["data_pedido"].dt.date <= fim)
        ]
else:
    df_filtrado = pd.DataFrame()

# 4. Abas do Painel
aba_vendas, aba_estoque, aba_avaliacoes = st.tabs(
    ["Vendas e Faturamento", "Alertas de Estoque", "Reputação e Avaliações"]
)

# ==================== ABA 1: VENDAS ====================
with aba_vendas:
    if df_vendas.empty:
        st.info("Você ainda não possui vendas registradas para exibir métricas.")
    elif df_filtrado.empty:
        st.warning("Nenhum registro encontrado para os filtros selecionados.")
    else:
        col_exp1, col_exp2, _ = st.columns([1, 1, 4])
        with col_exp1:
            st.download_button(
                label="Exportar JSON",
                data=df_filtrado.to_json(orient="records", indent=2, date_format="iso"),
                file_name="relatorio_vendas.json",
                mime="application/json",
                use_container_width=True,
            )
        with col_exp2:
            st.download_button(
                label="Exportar CSV",
                data=df_filtrado.to_csv(index=False).encode("utf-8-sig"),
                file_name="relatorio_vendas.csv",
                mime="text/csv",
                use_container_width=True,
            )

        st.divider()

        # KPIs Principais
        faturamento_total = float(df_filtrado["subtotal_item"].sum())
        total_pedidos = int(df_filtrado["pedido_id"].nunique())
        itens_vendidos = int(df_filtrado["quantidade"].sum())
        ticket_medio = float(df_filtrado.groupby("pedido_id")["subtotal_item"].sum().mean())
        nota_media_geral = (
            float(df_avaliacoes["nota"].mean()) if not df_avaliacoes.empty else 0.0
        )

        c1, c2, c3, c4, c5 = st.columns(5)
        c1.metric("Faturamento", formatar_brl(faturamento_total))
        c2.metric("Pedidos", total_pedidos)
        c3.metric("Itens Vendidos", itens_vendidos)
        c4.metric("Ticket Médio", formatar_brl(ticket_medio))
        c5.metric("Nota Média da Loja", f"{nota_media_geral:.1f} / 5.0" if nota_media_geral > 0 else "Sem notas")

        st.divider()

        # Evolução Temporal do Faturamento
        df_tempo = (
            df_filtrado.dropna(subset=["data_pedido"])
            .assign(dia=lambda d: d["data_pedido"].dt.date)
            .groupby("dia", as_index=False)["subtotal_item"]
            .sum()
            .sort_values("dia")
        )
        if not df_tempo.empty:
            fig_tempo = px.line(
                df_tempo,
                x="dia",
                y="subtotal_item",
                markers=True,
                title="Evolução do Faturamento por Dia",
                labels={"dia": "Data", "subtotal_item": "Faturamento (R$)"},
            )
            st.plotly_chart(fig_tempo, use_container_width=True)

        # Gráficos: Categoria e Status
        g1, g2 = st.columns(2)
        with g1:
            vendas_cat = (
                df_filtrado.groupby("categoria", as_index=False)["subtotal_item"]
                .sum()
                .sort_values("subtotal_item", ascending=False)
            )
            st.plotly_chart(
                px.bar(
                    vendas_cat,
                    x="categoria",
                    y="subtotal_item",
                    title="Faturamento por Categoria",
                    labels={"categoria": "Categoria", "subtotal_item": "Faturamento (R$)"},
                ),
                use_container_width=True,
            )

        with g2:
            vendas_status = (
                df_filtrado.groupby("status", as_index=False)["pedido_id"]
                .nunique()
            )
            st.plotly_chart(
                px.pie(
                    vendas_status,
                    names="status",
                    values="pedido_id",
                    hole=0.4,
                    title="Pedidos por Status",
                ),
                use_container_width=True,
            )

        # Gráficos: Top Produtos e Impacto de Cupons
        g3, g4 = st.columns(2)
        with g3:
            vendas_prod = (
                df_filtrado.groupby("produto", as_index=False)["subtotal_item"]
                .sum()
                .sort_values("subtotal_item", ascending=False)
                .head(10)
            )
            st.plotly_chart(
                px.bar(
                    vendas_prod,
                    x="produto",
                    y="subtotal_item",
                    title="Top 10 Produtos por Receita",
                    labels={"produto": "Produto", "subtotal_item": "Receita (R$)"},
                ),
                use_container_width=True,
            )

        with g4:
            uso_cupom = (
                df_filtrado.groupby("uso_cupom", as_index=False)["pedido_id"]
                .nunique()
            )
            st.plotly_chart(
                px.pie(
                    uso_cupom,
                    names="uso_cupom",
                    values="pedido_id",
                    hole=0.4,
                    title="Impacto de Cupons nos Pedidos",
                ),
                use_container_width=True,
            )

        # Tabela Detalhada
        st.subheader("Consulta Detalhada de Vendas")
        st.dataframe(df_filtrado, use_container_width=True)

# ==================== ABA 2: ESTOQUE ====================
with aba_estoque:
    if df_estoque.empty:
        st.info("Nenhum produto cadastrado para monitoramento de estoque.")
    else:
        esgotados = df_estoque[df_estoque["estoque"] <= 0]
        criticos = df_estoque[(df_estoque["estoque"] > 0) & (df_estoque["estoque"] <= 5)]
        saudaveis = df_estoque[df_estoque["estoque"] > 5]

        e1, e2, e3, e4 = st.columns(4)
        e1.metric("Total de Produtos", len(df_estoque))
        e2.metric("Esgotados (0 un.)", len(esgotados))
        e3.metric("Estoque Crítico (1 a 5 un.)", len(criticos))
        e4.metric("Estoque Saudável (> 5 un.)", len(saudaveis))

        if not esgotados.empty:
            st.error(f"Atenção: {len(esgotados)} produto(s) estão esgotados e bloqueados para venda.")
        if not criticos.empty:
            st.warning(f"Alerta: {len(criticos)} produto(s) estão com estoque crítico (5 unidades ou menos).")

        st.divider()

        df_estoque_plot = df_estoque.sort_values("estoque", ascending=True).head(15)
        df_estoque_plot["situacao"] = df_estoque_plot["estoque"].apply(
            lambda q: "Esgotado" if q <= 0 else ("Crítico" if q <= 5 else "Normal")
        )
        fig_estoque = px.bar(
            df_estoque_plot,
            x="produto",
            y="estoque",
            color="situacao",
            color_discrete_map={"Esgotado": "#EF4444", "Crítico": "#F59E0B", "Normal": "#10B981"},
            title="Nível de Estoque por Produto (Menores Quantidades)",
            labels={"produto": "Produto", "estoque": "Unidades em Estoque", "situacao": "Situação"},
        )
        st.plotly_chart(fig_estoque, use_container_width=True)

        st.subheader("Inventário Completo vs. Volume Vendido")
        st.dataframe(df_estoque, use_container_width=True)

# ==================== ABA 3: AVALIAÇÕES ====================
with aba_avaliacoes:
    if df_avaliacoes.empty:
        st.info("Ainda não há avaliações registradas para os seus produtos.")
    else:
        media_notas = float(df_avaliacoes["nota"].mean())
        total_av = len(df_avaliacoes)
        positivas = len(df_avaliacoes[df_avaliacoes["nota"] >= 4])
        pct_positivas = (positivas / total_av * 100) if total_av > 0 else 0.0

        a1, a2, a3 = st.columns(3)
        a1.metric("Nota Média Geral", f"{media_notas:.1f} ★")
        a2.metric("Total de Avaliações", total_av)
        a3.metric("Avaliações Positivas (4-5 ★)", f"{pct_positivas:.1f}%")

        st.divider()

        ga1, ga2 = st.columns(2)
        with ga1:
            dist_notas = (
                df_avaliacoes.groupby("nota", as_index=False)["id"]
                .count()
                .rename(columns={"id": "quantidade"})
                .sort_values("nota")
            )
            st.plotly_chart(
                px.bar(
                    dist_notas,
                    x="nota",
                    y="quantidade",
                    title="Distribuição de Notas (1 a 5 Estrelas)",
                    labels={"nota": "Nota", "quantidade": "Avaliações"},
                ),
                use_container_width=True,
            )

        with ga2:
            ranking_av = (
                df_avaliacoes.groupby("produto", as_index=False)
                .agg(nota_media=("nota", "mean"), total_avaliacoes=("id", "count"))
                .sort_values(["nota_media", "total_avaliacoes"], ascending=[False, False])
                .head(10)
            )
            st.plotly_chart(
                px.bar(
                    ranking_av,
                    x="produto",
                    y="nota_media",
                    title="Ranking de Produtos por Nota Média",
                    labels={"produto": "Produto", "nota_media": "Nota Média"},
                    range_y=[0, 5],
                ),
                use_container_width=True,
            )

        st.subheader("Comentários Recentes dos Clientes")
        colunas_exibir = [
            c for c in ["data_avaliacao", "produto", "categoria", "autor_nome", "nota", "comentario"]
            if c in df_avaliacoes.columns
        ]
        st.dataframe(df_avaliacoes[colunas_exibir], use_container_width=True)