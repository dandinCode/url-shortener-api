# Usa a imagem oficial do Node.js como base
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Compila o projeto NestJS
RUN npm run build

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
