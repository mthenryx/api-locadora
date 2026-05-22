/****************************************************************************************************** 
* Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados
*   para realizar o CRUD de fotos
* Data: /04/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const configMessages = require("../modulo/configMessages.js")

const fotosDAO = require('../../model/DAO/fotos/foto.js')

const validarDados = function (foto) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (foto.url == undefined || foto.url == '' || foto.url == null || foto.url.length > 255 || !isNaN(foto.url)) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = function (foto) {

    foto.url = foto.url.replaceAll("'", "")

    return foto
}

const inserirNovaFoto = async function (foto, contentType) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    let validar = await validarDados(foto)

    try {
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {

            if (validar) {
                return validar //400
            } else {
                let result = await fotosDAO.insertFoto(await tratarDados(foto))

                if (result) { //201
                    foto.id = result

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = foto

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

const atualizarFoto = async function (foto, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarFoto = await buscarFoto(id)

            if (resultBuscarFoto.status) {

                let validar = await validarDados(foto)

                if (!validar) {

                    foto.id = id

                    let result = await fotosDAO.updateFoto(await tratarDados(foto))

                    if (result) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = foto

                        return customMessage.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                    }

                } else {
                    return validar //400 de validação dos campos do banco de dados
                }

            } else {
                return resultBuscarFoto //400(id inválido) ou 404(não encontrado) ou 500
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarFoto = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await fotosDAO.selectAllFoto()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.foto = result

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

const buscarFoto = async function (id) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o ID seja um número válido
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST // 400
        } else {
            //Chama a função do DAO para pesquisar o filme pelo id
            let result = await fotosDAO.selectByIdFoto(id)

            //Validação para verificar se o DAO retornou dados ou um false
            if (result) {
                //Validação para verificar se o DAO tem algum dados no ARRAY
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.foto = result

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

const excluirFoto = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarFoto = await buscarFoto(id)

        if (resultBuscarFoto.status) {

            let result = await fotosDAO.deleteFoto(id)

            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETE_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETE_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETE_ITEM.message

                return customMessage.DEFAULT_MESSAGE //204 (Deletado)
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        } else {
            return resultBuscarFoto //400(id inválido) ou 404(não encontrado) ou 500
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaFoto,
    atualizarFoto,
    listarFoto,
    buscarFoto,
    excluirFoto
}