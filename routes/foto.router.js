// Import do EXPRESS
const express = require('express')
const bodyParser = require('body-parser')

//Permitindo a utilização do JSON no body das requisições
const bodyParserJSON = bodyParser.json()

//Criando um objeto de rota para os Endpoints de Genero
const router = express.Router()

const controllerFoto = require('../controller/foto/controller_foto.js')

//                                 ENDPOINTS FOTO
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']
    
    let result = await controllerFoto.inserirNovaFoto(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerFoto.listarFoto()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerFoto.buscarFoto(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerFoto.atualizarFoto(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerFoto.excluirFoto(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router