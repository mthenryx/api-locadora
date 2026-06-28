const configMessages = require('../modulo/configMessages.js')

const filmeAtorDAO = require('../../model/DAO/filme_ator/filme_ator.js')

const validarDados = async function (filmeAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (filmeAtor.id_filme == undefined || filmeAtor.id_filme == '' || filmeAtor.id_filme == null || filmeAtor.id_filme < 1 || isNaN(filmeAtor.id_filme)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
    } else if (filmeAtor.id_ator == undefined || filmeAtor.id_ator == '' || filmeAtor.id_ator == null || filmeAtor.id_ator < 1 || isNaN(filmeAtor.id_ator)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_ATOR] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const inserirNovoFilmeAtor = async function (filmeAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = await validarDados(filmeAtor)
        if (validacao)
            return validacao
        else {
            let result = await filmeAtorDAO.insertFilmeAtor(filmeAtor)

            if (result) {
                filmeAtor.id = result

                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                customMessages.DEFAULT_MESSAGE.response = filmeAtor

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarFilmeAtor = async function (filmeAtor, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarFilmeAtor(id)

        if (resultBuscarID.status) {
            let validar = await validarDados(filmeAtor)

            if (!validar) {
                filmeAtor.id = Number(id)

                let result = await filmeAtorDAO.updateFilmeAtor(filmeAtor)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = filmeAtor

                    return customMessages.DEFAULT_MESSAGE //200 (Atualizado)
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

const listarFilmeAtor = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await filmeAtorDAO.selectAllFilmeAtor()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.filme_ator = result

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_NOT_FOUND
            }
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarFilmeAtor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await filmeAtorDAO.selectByIdFilmeAtor(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_ator = result

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

const buscarAtoresIdFilme = async function (idFilme) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idFilme == undefined || String(idFilme).replaceAll(' ', '') == '' || idFilme == null || isNaN(idFilme) || idFilme <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await filmeAtorDAO.selectAtoresByIdFilme(idFilme)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_ator = result

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

const buscarFilmesIdAtores = async function (idAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idAtor == undefined || String(idAtor).replaceAll(' ', '') == '' || idAtor == null || isNaN(idAtor) || idAtor <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_ATOR] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await filmeAtorDAO.selectFilmesByIdAtor(idAtor)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_ator = result

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

const excluirFilmeAtor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarFilmeAtor(id)

        if (resultBuscarID.status) {
            let result = await filmeAtorDAO.deleteFilmeAtor(id)

            if (result) {
                return customMessages.SUCCESS_DELETE_ITEM
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return resultBuscarID
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const excluirAtoresIdFilme = async function (idFilme) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await filmeAtorDAO.deleteAtoresByIdFilme(idFilme)

        if (result) {
            return customMessages.SUCCESS_DELETE_ITEM
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

module.exports = {
    inserirNovoFilmeAtor,
    listarFilmeAtor,
    buscarFilmeAtor,
    buscarAtoresIdFilme,
    buscarFilmesIdAtores,
    atualizarFilmeAtor,
    excluirFilmeAtor,
    excluirAtoresIdFilme
}