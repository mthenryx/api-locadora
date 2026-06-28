const configMessages = require('../modulo/configMessages.js')

const fotoAtorDAO = require('../../model/DAO/foto_ator/foto_ator.js')

const validarDados = async function (fotoAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (fotoAtor.id_ator == undefined || fotoAtor.id_ator == '' || fotoAtor.id_ator == null || fotoAtor.id_ator < 1 || isNaN(fotoAtor.id_ator)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_ATOR] INVÁLIDO'
    } else if (fotoAtor.id_foto == undefined || fotoAtor.id_foto == '' || fotoAtor.id_foto == null || fotoAtor.id_foto < 1 || isNaN(fotoAtor.id_foto)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_FOTO] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const inserirNovaFotoAtor = async function (fotoAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = await validarDados(fotoAtor)
        if (validacao)
            return validacao
        else {
            let result = await fotoAtorDAO.insertFotoAtor(fotoAtor)

            if (result) {
                fotoAtor.id = result

                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                customMessages.DEFAULT_MESSAGE.response = fotoAtor

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarFotoAtor = async function (fotoAtor, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarFotoAtor(id)

        if (resultBuscarID.status) {
            let validar = await validarDados(fotoAtor)

            if (!validar) {
                fotoAtor.id = Number(id)

                let result = await fotoAtorDAO.updateFotoAtor(fotoAtor)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = fotoAtor

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

const listarFotoAtor = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await fotoAtorDAO.selectAllFotoAtor()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.foto_ator = result

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

const buscarFotoAtor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await fotoAtorDAO.selectByIdFotoAtor(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.foto_ator = result

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

const buscarFotosIdAtor = async function (idAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idAtor == undefined || String(idAtor).replaceAll(' ', '') == '' || idAtor == null || isNaN(idAtor) || idAtor < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_ATOR] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await fotoAtorDAO.selectFotosByIdAtor(idAtor)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.foto_ator = result

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

const buscarAtoresIdFoto = async function (idFoto) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idFoto == undefined || String(idFoto).replaceAll(' ', '') == '' || idFoto == null || isNaN(idFoto) || idFoto < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_FOTO] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await fotoAtorDAO.selectAtoresByIdFoto(idFoto)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.foto_ator = result

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

const excluirFotoAtor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarFotoAtor(id)

        if (resultBuscarID.status) {
            let result = await fotoAtorDAO.deleteFotoAtor(id)

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

const excluirFotosIdAtor = async function (idAtor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await fotoAtorDAO.deleteFotosByIdAtor(idAtor)

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
    inserirNovaFotoAtor,
    listarFotoAtor,
    buscarFotoAtor,
    buscarFotosIdAtor,
    buscarAtoresIdFoto,
    atualizarFotoAtor,
    excluirFotoAtor,
    excluirFotosIdAtor
}