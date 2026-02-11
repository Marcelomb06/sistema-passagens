# Sistema de Vendas de Passagens Aéreas

Sistema completo e funcional para venda de passagens aéreas desenvolvido com HTML, CSS, JavaScript e Node.js.

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Banco de Dados**: Simulado em memória (array)

## 📋 Funcionalidades

### Frontend
- ✈️ Tela inicial com banner atrativo
- 🔍 Busca de passagens com filtros
- 📋 Listagem de voos disponíveis
- 👤 Formulário de dados do passageiro
- 💳 Tela de pagamento (Cartão/PIX)
- ✅ Confirmação de compra
- 📱 Design responsivo

### Backend (API REST)
- `POST /api/voos/buscar` - Buscar voos disponíveis
- `POST /api/reservas` - Criar nova reserva
- `GET /api/reservas/:codigo` - Buscar reserva por código
- `GET /api/reservas` - Listar todas as reservas
- `DELETE /api/reservas/:codigo` - Cancelar reserva
- `POST /api/validar/cpf` - Validar CPF

## 🔧 Instalação

1. Instale o Node.js (https://nodejs.org/)

2. Navegue até a pasta do projeto:
```bash
cd sistema-passagens
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor:
```bash
npm start
```

5. Acesse no navegador:
```
http://localhost:3000
```

## 📂 Estrutura de Arquivos

```
sistema-passagens/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js             # JavaScript do frontend
├── server.js          # Servidor Node.js
├── package.json       # Dependências do projeto
└── README.md          # Documentação
```

## 🎨 Design

- Cores: Azul (#1e3c72, #667eea), Branco, Cinza
- Bordas arredondadas e sombras suaves
- Tipografia moderna (Segoe UI)
- Layout responsivo para mobile

## 💡 Validações Implementadas

- ✓ Validação de datas (não permite datas passadas)
- ✓ Validação de CPF (11 dígitos)
- ✓ Validação de cartão de crédito (16 dígitos)
- ✓ Máscaras de input (CPF, telefone, cartão)
- ✓ Campos obrigatórios

## 🔒 Segurança

Este é um projeto de demonstração. Para uso em produção:
- Implementar autenticação JWT
- Usar banco de dados real (MongoDB, PostgreSQL)
- Validações server-side completas
- HTTPS obrigatório
- Criptografia de dados sensíveis

## 📝 Licença

MIT License - Livre para uso educacional e comercial.
