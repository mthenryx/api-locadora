/****************************************************************************************************** 
* Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados
*   para realizar o CRUD de diretor
* Data: 20/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const configMessages = require("../modulo/configMessages.js")

const diretorDAO = require('../../model/DAO/diretor/diretor.js')

const validarDados = function (diretor) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (diretor.nome == undefined || diretor.nome == '' || diretor.nome == null || diretor.nome.length > 100 || !isNaN(diretor.nome)) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (diretor.biografia == undefined || diretor.biografia == null || !isNaN(diretor.biografia)) {
        customMessage.ERROR_BAD_REQUEST.field = '[BIOGRAFIA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (diretor.data_nascimento == undefined || diretor.data_nascimento == '' || diretor.data_nascimento == null || diretor.data_nascimento.length != 10) {
        customMessage.ERROR_BAD_REQUEST.field = '[DATA_NASCIMENTO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (diretor.id_nacionalidade == undefined || diretor.id_nacionalidade == '' || diretor.id_nacionalidade == null || !isNaN(diretor.id_nacionalidade)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_NACIONALIDADE] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (diretor.id_sexo == undefined || diretor.id_sexo == '' || diretor.id_sexo == null || !isNaN(diretor.id_sexo)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_SEXO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = function (diretor) {

    diretor.nome = diretor.nome.replaceAll("'", "")
    diretor.biografia = diretor.biografia.replaceAll("'", "")
    diretor.data_nascimento = diretor.data_nascimento.replaceAll("'", "")

    return diretor
}

const inserirNovoGenero = async function (diretor, contentType) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    let validar = await validarDados(diretor)

    try {
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {

            if (validar) {
                return validar //400
            } else {
                let result = await diretorDAO.insertDiretor(await tratarDados(diretor))

                if (result) { //201
                    diretor.id = result

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = diretor

                    return customMessages.DEFAULT_MESSAGE //201
                } else { //erro 500 (Model)
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const atualizarGenero = async function (diretor, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarDiretor = await buscarGenero(id)

            if (resultBuscarDiretor.status) {

                let validar = await validarDados(diretor)

                if (!validar) {

                    diretor.id = id

                    let result = await diretorDAO.updateDiretor(await tratarDados(diretor))

                    if (result) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = diretor

                        return customMessage.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                    }

                } else {
                    return validar //400 de validação dos campos do banco de dados
                }

            } else {
                return resultBuscarDiretor //400(id inválido) ou 404(não encontrado) ou 500
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarGenero = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await diretorDAO.selectAllDiretor()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.diretor = result

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_NOT_FOUND
            }
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL //500 (model)
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const buscarGenero = async function (id) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o ID seja um número válido
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST // 400
        } else {
            //Chama a função do DAO para pesquisar o filme pelo id
            let result = await diretorDAO.selectByIdGenero(id)

            //Validação para verificar se o DAO retornou dados ou um false
            if (result) {
                //Validação para verificar se o DAO tem algum dados no ARRAY
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.genero = result

                    return customMessages.DEFAULT_MESSAGE //200
                } else {
                    return customMessages.ERROR_NOT_FOUND //404
                }
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 (model)
            }
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500 (controller)
    }
}

const excluirGenero = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarGenero = await buscarGenero(id)

        if (resultBuscarGenero.status) {

            let result = await diretorDAO.deleteGenero(id)

            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETE_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETE_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETE_ITEM.message

                return customMessage.DEFAULT_MESSAGE //204 (Deletado)
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        } else {
            return resultBuscarGenero //400(id inválido) ou 404(não encontrado) ou 500
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoGenero,
    atualizarGenero,
    listarGenero,
    buscarGenero,
    excluirGenero
}