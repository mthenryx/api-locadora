const configMessages = require('../modulo/configMessages.js')

const atividadeDiretorDAO = require('../../model/DAO/atividade_diretor/atividade_diretor.js')

const validarDados = async function (atividadeDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (atividadeDiretor.id_diretor == undefined || atividadeDiretor.id_diretor == '' || atividadeDiretor.id_diretor == null || atividadeDiretor.id_diretor < 1 || isNaN(atividadeDiretor.id_diretor)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_DIRETOR] INVÁLIDO'
    } else if (atividadeDiretor.id_atividade == undefined || atividadeDiretor.id_atividade == '' || atividadeDiretor.id_atividade == null || atividadeDiretor.id_atividade < 1 || isNaN(atividadeDiretor.id_atividade)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_ATIVIDADE] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const inserirNovaAtividadeDiretor = async function (atividadeDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = await validarDados(atividadeDiretor)
        if (validacao)
            return validacao
        else {
            let result = await atividadeDiretorDAO.insertAtividadeDiretor(atividadeDiretor)

            if (result) {
                atividadeDiretor.id = result

                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                customMessages.DEFAULT_MESSAGE.response = atividadeDiretor

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarAtividadeDiretor = async function (atividadeDiretor, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarAtividadeDiretor(id)

        if (resultBuscarID.status) {
            let validar = await validarDados(atividadeDiretor)

            if (!validar) {
                atividadeDiretor.id = Number(id)

                let result = await atividadeDiretorDAO.updateAtividadeDiretor(atividadeDiretor)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = atividadeDiretor

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

const listarAtividadeDiretor = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await atividadeDiretorDAO.selectAllAtividadeDiretor()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.atividade_diretor = result

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

const buscarAtividadeDiretor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await atividadeDiretorDAO.selectByIdAtividadeDiretor(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.atividade_diretor = result

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

const buscarAtividadesIdDiretor = async function (idDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idDiretor == undefined || String(idDiretor).replaceAll(' ', '') == '' || idDiretor == null || isNaN(idDiretor) || idDiretor < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_DIRETOR] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await atividadeDiretorDAO.selectAtividadesByIdDiretor(idDiretor)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.atividade_diretor = result

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

const buscarDiretoresIdAtividade = async function (idAtividade) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idAtividade == undefined || String(idAtividade).replaceAll(' ', '') == '' || idAtividade == null || isNaN(idAtividade) || idAtividade < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_ATIVIDADE] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await atividadeDiretorDAO.selectDiretoresByIdAtividade(idAtividade)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.atividade_diretor = result

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

const excluirAtividadeDiretor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarAtividadeDiretor(id)

        if (resultBuscarID.status) {
            let result = await atividadeDiretorDAO.deleteAtividadeDiretor(id)

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

const excluirAtividadesIdDiretor = async function (idDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await atividadeDiretorDAO.deleteAtividadesByIdDiretor(idDiretor)

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
    inserirNovaAtividadeDiretor,
    listarAtividadeDiretor,
    buscarAtividadeDiretor,
    buscarAtividadesIdDiretor,
    buscarDiretoresIdAtividade,
    atualizarAtividadeDiretor,
    excluirAtividadeDiretor,
    excluirAtividadesIdDiretor
}