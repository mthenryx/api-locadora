/* ***********************************************************************************
* Objetivo: Arquivo responsável pela criação da API do projeto de Estados e Cidades
* Data: 01/04/2026  
* Verção: 1.0
* Autor: Matheus H.
* ************************************************************************************/

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

//Permitindo a utilização do JSON no body das requisições
const bodyParserJSON = bodyParser.json()

// Criando um objeto do express para criar uma API
const app = express()

//Configurações do CORS da API
const corsOptions = {
    origin: ["*"],    // Configuração de origem da requisição (IP ou Dominio)
    methods: "GET, POST, PUT, DELETE, OPTIONS",   // Configuração dos verbos que serão utilizados na API
    allowedHeaders: ["Content-type", "Authorization"] // Configurações de permissões
    // Tipo de dados  // Autorização de acesso
}

//Aplica as configurações do CORS no app (EXPRESS)
app.use(cors(corsOptions))

//Import das controllers do projeto
const controllerFilme = require("./controller/filme/controller_filme.js")

const controllerClassificacao = require("./controller/classificacao/controller_classificacao.js")

const controllerSexo = require("./controller/sexo/controller_sexo.js")

const controllerNacionalidade = require("./controller/nacionalidade/controller_nacionalidade.js")

const controllerFotos = require("./controller/fotos/controller_fotos.js")

const controllerGenero = require("./controller/genero/controller_genero.js")

//ENDPOINTS FILME
app.post('/v1/senai/locadora/filme', bodyParserJSON, async function (request, response) {
    //Recebendo o body da requisição
    let dados = request.body

    //Recebe o tipo de dados da requisição para validar se é JSON
    let contentType = request.headers['content-type']

    //Chama a função de inserir e encaminha os dados do filme e o contentType
    let result = await controllerFilme.inserirNovoFilme(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/filme', async function (request, response) {

    let result = await controllerFilme.listarFilme()

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/filme/:id', async function (request, response) {
    //Recebe o id do filme via parametro
    let id = request.params.id

    let result = await controllerFilme.buscarFilme(id)

    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/locadora/filme/:id', bodyParserJSON, async function (request, response) {

    //Recebe o content-type da requisição para validar se é JSON
    let contentType = request.headers['content-type']

    //Recebe o id do registro a ser atualizado
    let id = request.params.id

    //Recebe os dados do body, que serão modificados no BD
    let dados = request.body

    //Chama a fução para atualizar o filme, devemos encaminhar as 3 variáveis na mesm sequência
    //Que a função foi criada na controller
    let result = await controllerFilme.atualizarFilme(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/senai/locadora/filme/:id', async function (request, response) {
    //Recebe o id do registro a ser deletado
    let id = request.params.id

    //Chama a função que vai para deletar o filme
    let result = await controllerFilme.excluirFilme(id)

    response.status(result.status_code)
    response.json(result)
})

//ENDPOINTS CLASSIFICACAO
app.post('/v1/senai/locadora/classificacao', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerClassificacao.inserirNovaClassificacao(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/classificacao', async function (request, response) {

    let result = await controllerClassificacao.listarClassificacao()

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/classificacao/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerClassificacao.buscarClassificacaoId(id)

    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/locadora/classificacao/:id', bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await controllerClassificacao.atualizarClassificacao(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/senai/locadora/classificacao/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerClassificacao.excluirClassificacao(id)

    response.status(result.status_code)
    response.json(result)
})

//ENDPOINTS SEXO
app.post('/v1/senai/locadora/sexo', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerSexo.inserirNovoSexo(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/sexo', async function (request, response) {

    let result = await controllerSexo.listarSexo()

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/sexo/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerSexo.buscarSexoId(id)

    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/locadora/sexo/:id', bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await  controllerSexo.atualizarSexo(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/senai/locadora/sexo/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerSexo.excluirSexo(id)

    response.status(result.status_code)
    response.json(result)
})

//ENDPOINTS NACIONALIDADE
app.post('/v1/senai/locadora/nacionalidade', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerNacionalidade.inserirNovoNacionalidade(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/nacionalidade', async function (request, response) {

    let result = await controllerNacionalidade.listarNacionalidade()

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/nacionalidade/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerNacionalidade.buscarNacionalidadeId(id)

    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/locadora/nacionalidade/:id', bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await  controllerNacionalidade.atualizarNacionalidade(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/senai/locadora/nacionalidade/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerNacionalidade.excluirNacionalidade(id)

    response.status(result.status_code)
    response.json(result)
})

//ENDPOINTS FOTOS
app.post('/v1/senai/locadora/fotos', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerFotos.inserirNovaFoto(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/fotos', async function (request, response) {

    let result = await controllerFotos.listarFoto()

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/fotos/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerFotos.buscarFoto(id)

    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/locadora/fotos/:id', bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await controllerFotos.atualizarFoto(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/senai/locadora/fotos/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerFotos.excluirFoto(id)

    response.status(result.status_code)
    response.json(result)
})

//ENDPOINTS GENERO
app.post('/v1/senai/locadora/genero', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerGenero.inserirNovoGenero(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/genero', async function (request, response) {

    let result = await controllerGenero.listarGenero()

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/genero/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerGenero.buscarGenero(id)

    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/locadora/genero/:id', bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await controllerGenero.atualizarGenero(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/senai/locadora/genero/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerGenero.excluirGenero(id)

    response.status(result.status_code)
    response.json(result)
})

//ENDPOINTS Diretor
app.post('/v1/senai/locadora/genero', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerGenero.inserirNovoGenero(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/genero', async function (request, response) {

    let result = await controllerGenero.listarGenero()

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/genero/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerGenero.buscarGenero(id)

    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/locadora/genero/:id', bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await controllerGenero.atualizarGenero(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/senai/locadora/genero/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerGenero.excluirGenero(id)

    response.status(result.status_code)
    response.json(result)
})

app.listen(8080, function () {
    console.log("API aguardando novas requisições ...")
})