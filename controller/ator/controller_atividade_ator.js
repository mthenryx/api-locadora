const configMessages = require('../modulo/configMessages.js')

const atividadeAtorDAO = require('../../model/DAO/atividade_ator/atividade_ator.js')

const validarDados = async function (atividadeAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (atividadeAtor.id_ator == undefined || atividadeAtor.id_ator == '' || atividadeAtor.id_ator == null || atividadeAtor.id_ator < 1 || isNaN(atividadeAtor.id_ator)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_ATOR] INVÁLIDO'
    } else if (atividadeAtor.id_atividade == undefined || atividadeAtor.id_atividade == '' || atividadeAtor.id_atividade == null || atividadeAtor.id_atividade < 1 || isNaN(atividadeAtor.id_atividade)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_ATIVIDADE] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const inserirNovaAtividadeAtor = async function (atividadeAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = await validarDados(atividadeAtor)
        if (validacao)
            return validacao
        else {
            let result = await atividadeAtorDAO.insertAtividadeAtor(atividadeAtor)

            if (result) {
                atividadeAtor.id = result

                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                customMessages.DEFAULT_MESSAGE.response = atividadeAtor

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarAtividadeAtor = async function (atividadeAtor, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarAtividadeAtor(id)

        if (resultBuscarID.status) {
            let validar = await validarDados(atividadeAtor)

            if (!validar) {
                atividadeAtor.id = Number(id)

                let result = await atividadeAtorDAO.updateAtividadeAtor(atividadeAtor)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = atividadeAtor

                    return customMessages.DEFAULT_MESSAGE //200
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return validar
            }
        } else {
            return resultBuscarID
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarAtividadeAtor = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await atividadeAtorDAO.selectAllAtividadeAtor()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.atividade_ator = result

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_NOT_FOUND //404
            }
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const buscarAtividadeAtor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await atividadeAtorDAO.selectByIdAtividadeAtor(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.atividade_ator = result

                    return customMessages.DEFAULT_MESSAGE
                } else {
                    return customMessages.ERROR_NOT_FOUND
                }
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarAtividadesIdAtor = async function (idAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idAtor == undefined || String(idAtor).replaceAll(' ', '') == '' || idAtor == null || isNaN(idAtor) || idAtor < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_ATOR] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await atividadeAtorDAO.selectAtividadesByIdAtor(idAtor)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.atividade_ator = result

                    return customMessages.DEFAULT_MESSAGE
                } else {
                    return customMessages.ERROR_NOT_FOUND
                }
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarAtoresIdAtividade = async function (idAtividade) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idAtividade == undefined || String(idAtividade).replaceAll(' ', '') == '' || idAtividade == null || isNaN(idAtividade) || idAtividade < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_ATIVIDADE] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await atividadeAtorDAO.selectAtoresByIdAtividade(idAtividade)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.atividade_ator = result

                    return customMessages.DEFAULT_MESSAGE
                } else {
                    return customMessages.ERROR_NOT_FOUND
                }
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirAtividadeAtor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarAtividadeAtor(id)

        if (resultBuscarID.status) {
            let result = await atividadeAtorDAO.deleteAtividadeAtor(id)

            if (result) {
                return customMessages.SUCCESS_DELETE_ITEM
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return resultBuscarID
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirAtividadesIdAtor = async function (idAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await atividadeAtorDAO.deleteAtividadesByIdAtor(idAtor)

        if (result) {
            return customMessages.SUCCESS_DELETE_ITEM
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaAtividadeAtor,
    listarAtividadeAtor,
    buscarAtividadeAtor,
    buscarAtividadesIdAtor,
    buscarAtoresIdAtividade,
    atualizarAtividadeAtor,
    excluirAtividadeAtor,
    excluirAtividadesIdAtor
}