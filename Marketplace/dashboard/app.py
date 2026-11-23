import streamlit as st
import pandas as pd
import plotly.express as px
import requests

API_BASE_URL = "http://localhost:3000"

st.set_page_config(page_title="Dashboard do Vendedor", layout="wide")
st.title("Painel Administrativo - Métricas de Vendas")

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

# 2. Consulta automática dos dados do vendedor logado
headers = {"Authorization": f"Bearer {token}"}
try:
    resp = requests.get(
        f"{API_BASE_URL}/api/dashboard/exportar?formato=json",
        headers=headers,
        timeout=10,
    )
    if resp.status_code != 200:
        st.error(f"Erro ao carregar dados ({resp.status_code}): {resp.text}")
        st.stop()
    dados = resp.json()
except requests.exceptions.RequestException as e:
    st.error(f"Não foi possível conectar ao servidor: {e}")
    st.stop()

df = pd.DataFrame(dados)

if df.empty:
    st.info("Você ainda não possui vendas registradas para exibir métricas.")
    st.stop()

df["data_pedido"] = pd.to_datetime(df["data_pedido"])

# 3. Filtros laterais
st.sidebar.header("Filtros")
produtos_sel = st.sidebar.multiselect(
    "Produto",
    options=df["produto"].unique(),
    default=df["produto"].unique(),
)
status_sel = st.sidebar.multiselect(
    "Status do Pedido",
    options=df["status"].unique(),
    default=df["status"].unique(),
)

df_filtrado = df[df["produto"].isin(produtos_sel) & df["status"].isin(status_sel)]

# 4. Botões de Exportação (JSON e CSV) dentro do próprio Dashboard
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

# 5. KPIs Principais
c1, c2, c3, c4 = st.columns(4)
c1.metric("Faturamento", f"R$ {df_filtrado['subtotal_item'].sum():,.2f}")
c2.metric("Pedidos", int(df_filtrado["pedido_id"].nunique()))
c3.metric("Itens Vendidos", int(df_filtrado["quantidade"].sum()))
ticket = (
    df_filtrado.groupby("pedido_id")["subtotal_item"].sum().mean()
    if not df_filtrado.empty
    else 0
)
c4.metric("Ticket Médio", f"R$ {ticket:,.2f}")

st.divider()

# 6. Gráficos
g1, g2 = st.columns(2)
with g1:
    vendas_prod = (
        df_filtrado.groupby("produto")["subtotal_item"]
        .sum()
        .sort_values(ascending=False)
        .head(10)
        .reset_index()
    )
    st.plotly_chart(
        px.bar(vendas_prod, x="produto", y="subtotal_item", title="Receita por Produto"),
        use_container_width=True,
    )

with g2:
    vendas_status = df_filtrado.groupby("status")["pedido_id"].nunique().reset_index()
    st.plotly_chart(
        px.pie(vendas_status, names="status", values="pedido_id", title="Pedidos por Status"),
        use_container_width=True,
    )

# 7. Tabela Detalhada
st.subheader("Consulta Detalhada de Vendas")
st.dataframe(df_filtrado, use_container_width=True)