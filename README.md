# API RESTful - Locadora de Filmes

API RESTful desenvolvida para gerenciamento de uma locadora de filmes, com integração ao MySQL e suporte a operações CRUD completas em múltiplas entidades.

---

## 🚀 Sobre o Projeto

Esta API foi construída utilizando Node.js e Express, com arquitetura baseada em controllers, permitindo a manipulação de dados relacionados a uma locadora de filmes.

O projeto implementa operações CRUD (Create, Read, Update, Delete) e segue boas práticas de desenvolvimento backend e organização de código.

---

## 🛠️ Tecnologias Utilizadas

- Node.js  
- Express  
- MySQL  
- Knex.js (query builder)  
- Body-parser  
- CORS  
- Postman (Testar EDNPOINT)
- Swagger (Documentação)


---

## 📌 Funcionalidades

A API permite o gerenciamento das seguintes entidades:

- 🎥 Filmes  
- 🔞 Classificação indicativa  
- 🚻 Sexo  
- 🌍 Nacionalidade  
- 🖼️ Fotos  
- 🎭 Gêneros  

---

## 🧱 Arquitetura

O projeto segue uma estrutura baseada em:

```
📁 controller/
   ├── filme/
   ├── classificacao/
   ├── sexo/
   ├── nacionalidade/
   ├── fotos/
   └── genero/
```

Cada entidade possui seu próprio controller responsável pelas regras de negócio.

---

## 🔗 Endpoints

### 🎥 Filmes
- `POST /v1/senai/locadora/filme`
- `GET /v1/senai/locadora/filme`
- `GET /v1/senai/locadora/filme/:id`
- `PUT /v1/senai/locadora/filme/:id`
- `DELETE /v1/senai/locadora/filme/:id`

### 🔞 Classificação
- `POST /v1/senai/locadora/classificacao`
- `GET /v1/senai/locadora/classificacao`
- `GET /v1/senai/locadora/classificacao/:id`
- `PUT /v1/senai/locadora/classificacao/:id`
- `DELETE /v1/senai/locadora/classificacao/:id`

### 🚻 Sexo
- `POST /v1/senai/locadora/sexo`
- `GET /v1/senai/locadora/sexo`
- `GET /v1/senai/locadora/sexo/:id`
- `PUT /v1/senai/locadora/sexo/:id`
- `DELETE /v1/senai/locadora/sexo/:id`

### 🌍 Nacionalidade
- `POST /v1/senai/locadora/nacionalidade`
- `GET /v1/senai/locadora/nacionalidade`
- `GET /v1/senai/locadora/nacionalidade/:id`
- `PUT /v1/senai/locadora/nacionalidade/:id`
- `DELETE /v1/senai/locadora/nacionalidade/:id`

### 🖼️ Fotos
- `POST /v1/senai/locadora/fotos`
- `GET /v1/senai/locadora/fotos`
- `GET /v1/senai/locadora/fotos/:id`
- `PUT /v1/senai/locadora/fotos/:id`
- `DELETE /v1/senai/locadora/fotos/:id`

### 🎭 Gêneros
- `POST /v1/senai/locadora/genero`
- `GET /v1/senai/locadora/genero`
- `GET /v1/senai/locadora/genero/:id`
- `PUT /v1/senai/locadora/genero/:id`
- `DELETE /v1/senai/locadora/genero/:id`

---

## ⚙️ Como Rodar o Projeto

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
npm install
node app.js
```

A API estará rodando em:

```
http://localhost:8080
```

---

## 🧪 Testes

Recomenda-se o uso de:

- Postman  
- Insomnia  

---

## 📚 Objetivo

Este projeto foi desenvolvido com fins educacionais, com foco em:

- Construção de APIs RESTful  
- Integração com banco de dados MySQL  
- Organização em camadas (controllers)  
- Implementação de CRUD completo  

---

## 👨‍💻 Autor

Matheus H.

---

## 📄 Licença

Uso educacional.
