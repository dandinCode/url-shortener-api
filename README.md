# URL Shortener API

Este projeto se trata de uma API de um encurtador de link. Desenvolvido com NestJS, Typescrip, TypeORM e PostgreSQL.

---

## Sumário

- [Pré-requisitos](#pré-requisitos)  
- [Configuração de ambiente](#configuração-de-ambiente)  
- [Executando localmente](#executando-localmente)  
- [Executando com Docker](#executando-com-docker)  
- [Testes](#testes)  
- [Pontos de melhorias](#pontos-de-melhorias) 

---

## Pré-requisitos

- Node.js (versão 22 ou superior recomendada)  
- npm
- Docker e Docker Compose (para execução via containers)  
- PostgreSQL local (caso rode localmente sem Docker)  
- Clonar este repositório:

  ```bash
  git clone https://github.com/dandinCode/url-shortener-api.git
  cd url-shortener-api
  ```

---

## Configuração de ambiente

Este projeto utiliza arquivos `.env` para variáveis de ambiente:

- `.env.example` — modelo base com todas as variáveis necessárias  
- `.env` — para execução local, conecta ao banco local (`DB_HOST=localhost`)  
- `.env.docker` — para execução no Docker, conecta ao container de banco (`DB_HOST=db`)  

**Importante:**  
Ao rodar localmente, renomeie/copiar `.env.example` para `.env` e configure suas variáveis.  
Ao rodar via Docker, renomeie/copiar `.env.example` para `.env.docker` e configure conforme o ambiente.

---

## Executando localmente

1. Configure seu `.env` com as variáveis corretas,  especialmente `DB_HOST=localhost`.  
2. Instale dependências:

  ```bash
  npm install
  ```
4. Execute as migrations para criar as tabelas no banco:

  ```bash
  npm run migration:run
  ```

4. Inicie a aplicação em modo desenvolvimento:

  ```bash
  npm run start:dev
  ```

5. A API estará disponível em http://localhost:3000

---

## Executando com Docker

1. Copie o arquivo .env.example para .env.docker e configure as variáveis de ambiente, especialmente `DB_HOST=db`.
2. Execute o build e subida dos containers:
   
  ```bash
  docker compose up --build
  ```

3. O Docker irá iniciar dois containers:
  - postgres_db: banco de dados PostgreSQL
  - url-shortener-api: aplicação Node.js com a API
4. A aplicação estará disponível em http://localhost:3000

---

## Testes

1. Para rodar os testes end-to-end localmente, execute:
 
  ```bash
  npm run test:e2e
  ```
2. Para rodar os testes unitários localmente, execute:
  
  ```bash
  npm run test
  ```
3. Para realizar testes manualmente na API, rode a API (localmente ou pelo Docker), acesse http://localhost:3000/api e teste através do Swagger.

---

## Pontos de melhorias

1. Monitorar o sistema
- Quando o sistema começar a crescer e rodar em várias máquinas, ficará difícil saber se tudo está funcionando bem só olhando no terminal.
- Por isso, é importante ter ferramentas que reúnam logs das máquinas num lugar só, mostrem se a aplicação está com erros, lentidão, ou caiu e permitam criar alertas para avisar caso algo der errado
2. Consistência dos dados no banco
- Em um servidor de verdade provavelmente terão várias máquinas rodando a API, todas elas vão tentar acessar e modificar os dados ao mesmo tempo. É importante garantir que as atualizações (como contagem de cliques) sejam feitas de forma segura para não perder dados.  
