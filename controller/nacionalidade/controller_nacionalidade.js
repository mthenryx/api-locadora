/****************************************************************************************************** 
* Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados
*   para realizar o CRUD de Sexo
* Data: 13/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const configMessages = require("../modulo/configMessages.js")

const nacionalidadeDAO = require('../../model/DAO/nacionalidade/nacionalidade.js')

const validarDados = async function (nacionalidade) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (nacionalidade.nacionalidade == undefined || nacionalidade.nacionalidade == '' || nacionalidade.nacionalidade == null || nacionalidade.nacionalidade.length > 90 || !isNaN(nacionalidade.nacionalidade)) {
        customMessage.ERROR_BAD_REQUEST.field = '[NACIONALIDADE] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (nacionalidade.sigla == undefined || nacionalidade.sigla == '' || nacionalidade.sigla == null || nacionalidade.sigla.length > 4 || !isNaN(nacionalidade.sigla)) {
        customMessage.ERROR_BAD_REQUEST.field = '[SIGLA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = function (nacionalidade) {

    nacionalidade.nacionalidade = nacionalidade.nacionalidade.replaceAll("'", "")
    nacionalidade.sigla = nacionalidade.sigla.replaceAll("'", "")

    return nacionalidade
}

const inserirNovoNacionalidade = async function (nacionalidade, contentType) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    let validar = await validarDados(nacionalidade)

    try {
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {

            if (validar) {
                return validar //400
            } else {
                let result = await nacionalidadeDAO.insertNacionalidade(await tratarDados(nacionalidade))

                if (result) { //201
                    nacionalidade.id = result

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = nacionalidade

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

const listarNacionalidade = async function () {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await nacionalidadeDAO.selectAllNacionalidade()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.nacionalidade = result

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

const buscarNacionalidadeId = async function (id) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST // 400
        } else {

            let result = await nacionalidadeDAO.selectByIdNacionalidade(id)

            if (result) {

                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.nacionalidade = result

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

const atualizarNacionalidade = async function (nacionalidade, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarNacionalidade = await buscarNacionalidadeId(id)

            if (resultBuscarNacionalidade.status) {

                let validar = await validarDados(nacionalidade)

                if (!validar) {

                    nacionalidade.id = id

                    let result = await nacionalidadeDAO.updateNacionalidade(await tratarDados(nacionalidade))

                    if (result) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = nacionalidade

                        return customMessage.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                    }

                } else {
                    return validar //400 de validação dos campos do banco de dados
                }

            } else {
                return resultBuscarNacionalidade //400(id inválido) ou 404(não encontrado) ou 500
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirNacionalidade = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarNacionalidade = await buscarNacionalidadeId(id)

        if (resultBuscarNacionalidade.status) {

            let result = await nacionalidadeDAO.deleteNacionalidade(id)

            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETE_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETE_ITEM.status_code

                return customMessage.DEFAULT_MESSAGE //204 (Deletado)
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        } else {
            return resultBuscarNacionalidade //400(id inválido) ou 404(não encontrado) ou 500
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoNacionalidade,
    listarNacionalidade,
    buscarNacionalidadeId,
    atualizarNacionalidade,
    excluirNacionalidade
}