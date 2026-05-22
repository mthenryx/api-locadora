/****************************************************************************************************** 
* Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados
*   para realizar o CRUD de Sexo
* Data: 13/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const configMessages = require("../modulo/configMessages.js")

const sexoDAO = require('../../model/DAO/sexo/sexo.js')

const validarDados = async function (sexo) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (sexo.sexo == undefined || sexo.sexo == '' || sexo.sexo == null || sexo.sexo.length > 20 || !isNaN(sexo.sexo)) {
        customMessage.ERROR_BAD_REQUEST.field = '[SEXO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (sexo.sigla == undefined || sexo.sigla == '' || sexo.sigla == null || sexo.sigla.length > 4 || !isNaN(sexo.sigla)) {
        customMessage.ERROR_BAD_REQUEST.field = '[SIGLA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = function (sexo) {

    sexo.sexo = sexo.sexo.replaceAll("'", "")
    sexo.sigla = sexo.sigla.replaceAll("'", "")

    return sexo
}

const inserirNovoSexo = async function (sexo, contentType) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    let validar = await validarDados(sexo)

    try {
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {

            if (validar) {
                return validar //400
            } else {
                let result = await sexoDAO.insertSexo(await tratarDados(sexo))

                if (result) { //201
                    sexo.id = result

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = sexo

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

const listarSexo = async function () {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await sexoDAO.selectAllSexo()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.sexo = result

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

const buscarSexoId = async function (id) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST // 400
        } else {

            let result = await sexoDAO.selectByIdSexo(id)

            if (result) {

                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.sexo = result

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

const atualizarSexo = async function (sexo, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarSexo = await buscarSexoId(id)

            if (resultBuscarSexo.status) {

                let validar = await validarDados(sexo)

                if (!validar) {

                    sexo.id = id

                    let result = await sexoDAO.updateSexo(await tratarDados(sexo))

                    if (result) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = sexo

                        return customMessage.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                    }

                } else {
                    return validar //400 de validação dos campos do banco de dados
                }

            } else {
                return resultBuscarSexo //400(id inválido) ou 404(não encontrado) ou 500
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirSexo = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarSexo = await buscarSexoId(id)

        if (resultBuscarSexo.status) {

            let result = await sexoDAO.deleteSexo(id)

            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETE_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETE_ITEM.status_code

                return customMessage.DEFAULT_MESSAGE //204 (Deletado)
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        } else {
            return resultBuscarSexo //400(id inválido) ou 404(não encontrado) ou 500
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoSexo,
    listarSexo,
    buscarSexoId,
    atualizarSexo,
    excluirSexo
}