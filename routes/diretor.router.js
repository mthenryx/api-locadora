const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerDiretor = require('../controller/diretor/controller_diretor.js')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerDiretor.inserirNovoDiretor(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerDiretor.listarDiretor()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerDiretor.buscarDiretor(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerDiretor.atualizarDiretor(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    const result = await controllerDiretor.excluirDiretor(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router