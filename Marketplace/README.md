# Marketplace MVP

Bem-vindo ao projeto do Marketplace! Este repositório está organizado como um monorepo, contendo tanto o ecossistema do aplicativo mobile quanto a API backend.

## Estrutura do Projeto

- `/mobile`: Contém todo o código do aplicativo (React Native + Expo).
- `/backend`: Contém a API do sistema (Node.js + Express + SQLite).

---

## 📱 Mobile (Aplicativo)

O aplicativo foi desenvolvido utilizando React Native e Expo.

### Como rodar o app localmente

1. Entre no diretório do app:
   ```bash
   cd mobile
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```

## ⚙️ Backend (API)

O backend é uma API Node.js utilizando Express e banco de dados SQLite.

### Como rodar a API localmente

1. Entre no diretório do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

A API estará rodando por padrão em `http://localhost:3000`.

---
*Para mais detalhes, verifique a documentação ou comentários específicos dentro de cada diretório (`mobile` e `backend`).*
