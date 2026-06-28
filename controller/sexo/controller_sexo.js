const configMessages = require('../modulo/configMessages.js')

const sexoDAO = require('../../model/DAO/sexo/sexo.js')

const validarDados = async function (sexo) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (sexo.sexo == undefined || sexo.sexo == '' || sexo.sexo == null || sexo.sexo.length > 20 ||
        sexo.sigla == undefined || sexo.sigla == '' || sexo.sigla == null || sexo.sigla.length > 4) {
        customMessages.ERROR_BAD_REQUEST.field = '[SEXO] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const tratarDados = async function (sexo) {
    sexo.sexo = sexo.sexo.replaceAll("'", "")
    sexo.sigla = sexo.sigla.replaceAll("'", "")

    return sexo
}

const inserirNovoSexo = async function (sexo, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validacao = await validarDados(sexo)
            if (validacao)
                return validacao //400
            else { //200
                let result = await sexoDAO.insertSexo(await tratarDados(sexo))

                if (result) {
                    sexo.id = result

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = sexo

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

const atualizarSexo = async function (sexo, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarSexo = await buscarSexo(id)

            if (resultBuscarSexo.status) {
                let validar = await validarDados(sexo)

                if (!validar) {
                    sexo.id = Number(id)

                    let result = await sexoDAO.updateSexo(await tratarDados(sexo))

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response = sexo

                        return customMessages.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return customMessages.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return validar
                }
            } else {
                return resultBuscarSexo
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
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
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarSexo = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await sexoDAO.selectByIdSexo(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.sexo = result

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

const excluirSexo = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarSexo = await buscarSexo(id)

        if (resultBuscarSexo.status) {
            let result = await sexoDAO.deleteSexo(id)

            if (result) {
                return customMessages.SUCCESS_DELETE_ITEM
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return resultBuscarSexo
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

module.exports = {
    inserirNovoSexo,
    listarSexo,
    buscarSexo,
    atualizarSexo,
    excluirSexo
}