# CubosBank 🏦

Este é o projeto do Desafio do Módulo 2 do curso fullstack da [@cuboscademy](https://github.com/cubos-academy).

## Descrição

O projeto consiste em uma aplicação backend que gerencia contas bancárias, permitindo a criação, atualização, exclusão, consulta de saldo, emissão de extrato, depósito, saque e transferência entre contas.

## Estrutura do Projeto

- **src**: Pasta contendo os arquivos fonte da aplicação.
  - **controladores**: Pasta contendo os controladores do projeto.
    - `cubosController.js`: Controlador principal para as funcionalidades relacionadas às contas bancárias.
  - `bancodedados.json`: Arquivo de banco de dados JSON.
  - `index.js`: Arquivo principal do servidor.
  - `middleware.js`: Arquivo contendo os middlewares utilizados no projeto.
  - `rotas.js`: Arquivo contendo as definições das rotas do projeto.
- `.gitignore`: Arquivo que especifica os arquivos e diretórios a serem ignorados pelo Git.
- `package-lock.json`: Arquivo gerado automaticamente pelo npm para registrar as dependências exatas do projeto.
- `package.json`: Arquivo de manifesto do projeto, contendo metadados e dependências.
- `README.md`: Arquivo de instruções do projeto.

## Como Executar o Projeto

### Passos para Executar o Projeto

1. **Acessando o Repositório no GitHub**: Primeiramente, acesse o repositório do projeto no GitHub através do seguinte link: [https://github.com/danielluizdl/desafio-backend-m2-t15](https://github.com/danielluizdl/desafio-backend-m2-t15). Em seguida, clique no botão "Fork" no canto superior direito da página. Isso criará uma cópia do repositório em sua própria conta do GitHub.

2. **Clonando o Repositório**: Após o fork, acesse o repositório em sua conta do GitHub e copie o URL. Em seguida, clone o projeto para o seu ambiente local utilizando o comando `git clone` no terminal, fornecendo a URL do repositório.

3. **Instalando as Dependências**: Abra seu Editor de Código favorito, como o Visual Studio Code, e instale as bibliotecas necessárias utilizando o comando `npm install`. As bibliotecas essenciais são: `express` e `date-fns`. Opcionalmente, você pode instalar o `nodemon` para facilitar o desenvolvimento.

4. **Executando o Projeto**: No terminal, execute o comando `node .src/index.js` para iniciar o servidor e executar o projeto.

5. **Explorando as Rotas**: Agora que o servidor está em execução, abra seu gerenciador de rotas preferido e comece a criar requisições para interagir com as diferentes funcionalidades do banco.

Esses passos simples permitirão que você experimente e explore as funcionalidades da API que estamos desenvolvendo. Fique à vontade para testar as diferentes rotas e funcionalidades disponíveis!

## Referência Visual:

- Você pode acessar esse link para visualizar todas as screenshots das solicitações.

  👀 [REF VISUAL](https://drive.google.com/drive/folders/1-epysFp33SUe64eeUqohGMpgEpCwbdqp?usp=sharing)


## Endpoints

### Listar Contas Bancárias

- Método: GET
- Rota: `/contas?senha_banco=Cubos123Bank`
- Função: listarContas
- Middleware: validarSenhaBanco

**Requisição** - query params:

```json
{
"senha_banco": "Cubos123Bank"
}
```
### Resposta
-  Listagem de todas as contas bancárias existentes ou mensagem de erro se a senha do banco informada for inválida.

## Criar Conta Bancária

- **Método:** POST
- **Rota:** `/contas`
- **Função:** criarConta

### Requisição

```json
{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}
```
### Resposta
**Sucesso:**  Sem conteúdo no corpo da resposta </br>
**Falha:** Mensagem indicando que já existe uma conta com o CPF ou e-mail informado.

## Atualizar Usuário da Conta Bancária

- **Método:** PUT
- **Rota:** `/contas/:numeroConta/usuario`
- **Função:** atualizarUsuarioConta

### Requisição

```json
{
    "nome": "Foo Bar 3",
    "cpf": "99911122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar3.com",
    "senha": "12345"
}
```
### Resposta 
- **Sucesso:** Sem conteúdo no corpo da resposta</br>
- **Falha:** Mensagem indicando que o CPF informado já existe cadastrado.

## Excluir Conta

- **Método:** DELETE
- **Rota:** `/contas/:numeroConta`
- **Função:** excluirConta

### Resposta
- **Sucesso:** Sem conteúdo no corpo da resposta
- **Falha:** Mensagem indicando que a conta só pode ser removida se o saldo for zero.

## Depositar

- **Método:** POST
- **Rota:** `/transacoes/depositar`

### Requisição
```json
{
    "numero_conta": "1",
    "valor": 1900
}
```
### Resposta
- **Sucesso:** Sem conteúdo no corpo da resposta
- **Falha:** Mensagem indicando que o número da conta e o valor são obrigatórios.

## Sacar
- **Método:** POST
- **Rota:** `/transacoes/sacar`

### Requisição

```json
{
    "numero_conta": "1",
    "valor": 1900,
    "senha": "123456"
}
```
### Resposta
- **Sucesso:** Sem conteúdo no corpo da resposta
- **Falha:** Mensagem indicando que o valor não pode ser menor que zero.

## Transferir
**Método:** POST
**Rota:** `/transacoes/transferir`

### Requisição

```json
{
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 200,
    "senha": "123456"
}
```
### Resposta
- **Sucesso:** Sem conteúdo no corpo da resposta
- **Falha:** Mensagem indicando saldo insuficiente.

## Saldo

- **Método:** GET
- **Rota:** `/contas/saldo?numero_conta=123&senha=123`

### Resposta

- Saldo da conta ou mensagem indicando conta bancária não encontrada.

## Extrato

- **Método:** GET
- **Rota:** `/contas/extrato?numero_conta=123&senha=123`

### Resposta

- Relatório da conta ou mensagem indicando conta bancária não encontrada.

