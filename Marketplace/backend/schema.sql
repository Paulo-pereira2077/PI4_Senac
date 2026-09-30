-- schema.sql — Referência das tabelas (geradas automaticamente pelo Sequelize)

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cpf TEXT,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  tipo_perfil TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Endereços (1:N com Usuários)
CREATE TABLE IF NOT EXISTS enderecos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  rua TEXT NOT NULL,
  numero TEXT NOT NULL,
  bairro TEXT,
  cidade TEXT NOT NULL,
  cep TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- 3. Métodos de Pagamento Salvos (1:N com Usuários)
CREATE TABLE IF NOT EXISTS metodos_pagamento_usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  bandeira TEXT NOT NULL,
  ultimos_digitos TEXT NOT NULL,
  token_ficticio TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- 4. NOVA: Categorias de Produtos
CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  icone_url TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. ATUALIZADA: Produtos (Com categoria, preços promocionais e estoque)
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendedor_id INTEGER NOT NULL,
  categoria_id INTEGER NOT NULL, -- Vínculo com a Categoria
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco_unidade REAL NOT NULL DEFAULT 0,
  preco_promocional REAL, -- Novo: Para descontos
  em_oferta BOOLEAN DEFAULT 0, -- Novo: Sinalizador (0 = falso, 1 = verdadeiro)
  quantidade_estoque INTEGER NOT NULL DEFAULT 0,
  imagem_capa_url TEXT,
  ativo BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias (id)
);

-- 6. NOVA: Imagens Adicionais do Produto (1:N com Produtos)
CREATE TABLE IF NOT EXISTS imagens_produto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  url_imagem TEXT NOT NULL,
  ordem_exibicao INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE
);

-- 7. NOVA: Avaliações e Comentários (Social Proof)
CREATE TABLE IF NOT EXISTS avaliacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  cliente_id INTEGER NOT NULL,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5), -- Garante notas de 1 a 5
  comentario TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- 8. NOVA: Carrinho Persistente (Carrinho Abandonado)
CREATE TABLE IF NOT EXISTS itens_carrinho (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE
);

-- 9. Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  endereco_entrega_id INTEGER,
  total REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pendente',
  metodo_pagamento TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios (id),
  FOREIGN KEY (endereco_entrega_id) REFERENCES enderecos (id)
);

-- 10. NOVA: Histórico e Rastreio do Pedido (Timeline)
CREATE TABLE IF NOT EXISTS historico_status_pedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  observacao TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE
);

-- 11. Itens do Pedido (A "Fotografia" do que foi comprado)
CREATE TABLE IF NOT EXISTS itens_pedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco_uni REAL NOT NULL, -- Preço no momento exato do checkout
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos (id)
);