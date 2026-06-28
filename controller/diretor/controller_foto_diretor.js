const configMessages = require('../modulo/configMessages.js')

const fotoDiretorDAO = require('../../model/DAO/foto_diretor/foto_diretor.js')

const validarDados = async function (fotoDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (fotoDiretor.id_diretor == undefined || fotoDiretor.id_diretor == '' || fotoDiretor.id_diretor == null || fotoDiretor.id_diretor < 1 || isNaN(fotoDiretor.id_diretor)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_DIRETOR] INVÁLIDO'
    } else if (fotoDiretor.id_foto == undefined || fotoDiretor.id_foto == '' || fotoDiretor.id_foto == null || fotoDiretor.id_foto < 1 || isNaN(fotoDiretor.id_foto)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_FOTO] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const inserirNovaFotoDiretor = async function (fotoDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = await validarDados(fotoDiretor)
        if (validacao)
            return validacao
        else {
            let result = await fotoDiretorDAO.insertFotoDiretor(fotoDiretor)

            if (result) {
                fotoDiretor.id = result

                customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                customMessages.DEFAULT_MESSAGE.response     = fotoDiretor

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarFotoDiretor = async function (fotoDiretor, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarFotoDiretor(id)

        if (resultBuscarID.status) {
            let validar = await validarDados(fotoDiretor)

            if (!validar) {
                fotoDiretor.id = Number(id)

                let result = await fotoDiretorDAO.updateFotoDiretor(fotoDiretor)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = fotoDiretor

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

const listarFotoDiretor = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await fotoDiretorDAO.selectAllFotoDiretor()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count           = result.length
                customMessages.DEFAULT_MESSAGE.response.foto_diretor    = result

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

const buscarFotoDiretor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await fotoDiretorDAO.selectByIdFotoDiretor(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.foto_diretor    = result

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

const buscarFotosIdDiretor = async function (idDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idDiretor == undefined || String(idDiretor).replaceAll(' ', '') == '' || idDiretor == null || isNaN(idDiretor) || idDiretor < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_DIRETOR] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await fotoDiretorDAO.selectFotosByIdDiretor(idDiretor)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.foto_diretor    = result

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

const buscarDiretoresIdFoto = async function (idFoto) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idFoto == undefined || String(idFoto).replaceAll(' ', '') == '' || idFoto == null || isNaN(idFoto) || idFoto < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_FOTO] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await fotoDiretorDAO.selectDiretoresByIdFoto(idFoto)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.foto_diretor    = result

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

const excluirFotoDiretor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarFotoDiretor(id)

        if (resultBuscarID.status) {
            let result = await fotoDiretorDAO.deleteFotoDiretor(id)

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

const excluirFotosIdDiretor = async function (idDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await fotoDiretorDAO.deleteFotosByIdDiretor(idDiretor)

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
    inserirNovaFotoDiretor,
    listarFotoDiretor,
    buscarFotoDiretor,
    buscarFotosIdDiretor,
    buscarDiretoresIdFoto,
    atualizarFotoDiretor,
    excluirFotoDiretor,
    excluirFotosIdDiretor
}