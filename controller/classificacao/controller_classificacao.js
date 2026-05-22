/****************************************************************************************************** 
* Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados
*   para realizar o CRUD de Classificacao
* Data: 08/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const configMessages = require("../modulo/configMessages.js")

const classificacaoDAO = require('../../model/DAO/classificacao/classificacao.js')

const validarDados = async function (classificacao) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (classificacao == undefined || classificacao == '' || classificacao == null || classificacao.length > 6) {
        customMessage.ERROR_BAD_REQUEST.field = '[CLASSIFICACAO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = function (classificacao) {

    classificacao.classificacao = classificacao.classificacao.replaceAll("'", "")

    return classificacao
}

const inserirNovaClassificacao = async function (classificacao, contentType) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    let validar = await validarDados(classificacao.classificacao)

    try {
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {

            if (validar) {
                return validar //400
            } else {
                let result = await classificacaoDAO.insertClassificacao(await tratarDados(classificacao))

                if (result) { //201
                    classificacao.id = result

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = classificacao

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

const listarClassificacao = async function () {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await classificacaoDAO.selectAllClassificacao()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.classificacao = result

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

const buscarClassificacaoId = async function (id) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {

        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST // 400
        } else {

            let result = await classificacaoDAO.selectByIdClassificacao(id)

            if (result) {

                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.classificacao = result

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

const atualizarClassificacao = async function (classificacao, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarClassificacao = await buscarClassificacaoId(id)

            if (resultBuscarClassificacao.status) {

                let validar = await validarDados(classificacao)

                if (!validar) {

                    let result = await classificacaoDAO.updateClassificacao(await tratarDados(classificacao))

                    if (result) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = classificacao

                        return customMessage.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                    }

                } else {
                    return validar //400 de validação dos campos do banco de dados
                }

            } else {
                return resultBuscarClassificacao //400(id inválido) ou 404(não encontrado) ou 500
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirClassificacao = async function (id) {

     let customMessage = JSON.parse(JSON.stringify(configMessages))

     try {
        
          let resultBuscarClassificacao = await buscarClassificacaoId(id)

          if (resultBuscarClassificacao.status) {

               let result = await classificacaoDAO.deleteClassificacao(id)

               if (result) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETE_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETE_ITEM.status_code

                    return customMessage.DEFAULT_MESSAGE //204 (Deletado)
               } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
               }
          } else {
               return resultBuscarClassificacao //400(id inválido) ou 404(não encontrado) ou 500
          }
     } catch (error) {
          return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
     }
}

module.exports = {
    inserirNovaClassificacao,
    listarClassificacao,
    buscarClassificacaoId,
    atualizarClassificacao,
    excluirClassificacao
}