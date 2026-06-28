const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerAtor = require('../controller/ator/controller_ator.js')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerAtor.inserirNovoAtor(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerAtor.listarAtor()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerAtor.buscarAtor(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerAtor.atualizarAtor(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    const result = await controllerAtor.excluirAtor(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router