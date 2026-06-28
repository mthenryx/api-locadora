const configMessages = require('../modulo/configMessages.js')

const fotoDAO = require('../../model/DAO/foto/foto.js')

const controllerFotoAtor    = require('../ator/controller_foto_ator.js')
const controllerFotoDiretor = require('../diretor/controller_foto_diretor.js')

const validarDados = async function (foto) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (foto.foto_url == undefined || foto.foto_url == '' || foto.foto_url == null ||  foto.foto_url.length > 255) {
        customMessages.ERROR_BAD_REQUEST.field = '[FOTO] INVÁLIDa'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const tratarDados = async function (foto) {
    foto.foto_url = foto.foto_url.replaceAll("'", "")

    return foto
}

const inserirNovaFoto = async function (foto, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validacao = await validarDados(foto)
            if (validacao)
                return validacao
            else {
                let result = await fotoDAO.insertFoto(await tratarDados(foto))

                if (result) {
                    foto.id = result

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = foto

                    return customMessages.DEFAULT_MESSAGE
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarFoto = async function (foto, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarFoto = await buscarFoto(id)

            if (resultBuscarFoto.status) {
                let validar = await validarDados(foto)

                if (!validar) {
                    foto.id = Number(id)

                    let result = await fotoDAO.updateFoto(await tratarDados(foto))

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = foto

                        return customMessages.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return customMessages.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return validar
                }
            } else {
                return resultBuscarFoto
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarFoto = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await fotoDAO.selectAllFoto()

        if (result) {
            if (result.length > 0) {
                for (let foto of result) {
                    let resultFotoAtor = await controllerFotoAtor.buscarAtoresIdFoto(foto.id)

                    if (resultFotoAtor.status)
                        foto.ator = resultFotoAtor.response.foto_ator

                    let resultFotoDiretor = await controllerFotoDiretor.buscarDiretoresIdFoto(foto.id)

                    if (resultFotoDiretor.status)
                        foto.diretor = resultFotoDiretor.response.foto_diretor
                }

                customMessages.DEFAULT_MESSAGE.status               = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code          = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count       = result.length
                customMessages.DEFAULT_MESSAGE.response.foto_url    = result

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

const buscarFoto = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null ||  isNaN(id) || id <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await fotoDAO.selectByIdFoto(id)

            if (result) {
                if (result.length > 0) {
                    for (let foto of result) {
                    let resultFotoAtor = await controllerFotoAtor.buscarAtoresIdFoto(foto.id)

                    if (resultFotoAtor.status)
                        foto.ator = resultFotoAtor.response.foto_ator

                    let resultFotoDiretor = await controllerFotoDiretor.buscarDiretoresIdFoto(foto.id)

                    if (resultFotoDiretor.status)
                        foto.diretor = resultFotoDiretor.response.foto_diretor
                }

                    customMessages.DEFAULT_MESSAGE.status               = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code          = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.foto_url    = result

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

const excluirFoto = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarFoto = await buscarFoto(id)

        if (resultBuscarFoto.status) {
            let result = await fotoDAO.deleteFoto(id)

            if (result) {
                return customMessages.SUCCESS_DELETE_ITEM
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return resultBuscarFoto
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

module.exports = {
    inserirNovaFoto,
    listarFoto,
    buscarFoto,
    atualizarFoto,
    excluirFoto
}