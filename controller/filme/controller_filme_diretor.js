const configMessages = require('../modulo/configMessages.js')

const filmeDiretorDAO = require('../../model/DAO/filme_diretor/filme_diretor.js')

const validarDados = async function (filmeDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (filmeDiretor.id_filme == undefined || filmeDiretor.id_filme == '' || filmeDiretor.id_filme == null || filmeDiretor.id_filme < 1 || isNaN(filmeDiretor.id_filme)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
    } else if (filmeDiretor.id_diretor == undefined || filmeDiretor.id_diretor == '' || filmeDiretor.id_diretor == null || filmeDiretor.id_diretor < 1 || isNaN(filmeDiretor.id_diretor)) {
        customMessages.ERROR_BAD_REQUEST.field = '[id_diretor] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const inserirNovoFilmeDiretor = async function (filmeDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = await validarDados(filmeDiretor)
        if (validacao)
            return validacao
        else {
            let result = await filmeDiretorDAO.insertFilmeDiretor(filmeDiretor)

            if (result) {
                filmeDiretor.id = result

                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                customMessages.DEFAULT_MESSAGE.response = filmeDiretor

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarFilmeDiretor = async function (filmeDiretor, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarFilmeDiretor(id)

        if (resultBuscarID.status) {
            let validar = await validarDados(filmeDiretor)

            if (!validar) {
                filmeDiretor.id = Number(id)

                let result = await filmeDiretorDAO.updateFilmeDiretor(filmeDiretor)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = filmeDiretor

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

const listarFilmeDiretor = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await filmeDiretorDAO.selectAllFilmeDiretor()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.filme_diretor = result

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

const buscarFilmeDiretor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await filmeDiretorDAO.selectByIdFilmeDiretor(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_diretor = result

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

const buscarDiretoresIdFilme = async function (idFilme) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idFilme == undefined || String(idFilme).replaceAll(' ', '') == '' || idFilme == null || isNaN(idFilme) || idFilme <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await filmeDiretorDAO.selectDiretoresByIdFilme(idFilme)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_diretor = result

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

const buscarFilmesIdDiretor = async function (idDiretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idDiretor == undefined || String(idDiretor).replaceAll(' ', '') == '' || idDiretor == null || isNaN(idDiretor) || idDiretor <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_DIRETOR] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await filmeDiretorDAO.selectFilmesByIdDiretor(idDiretor)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_diretor = result

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

const excluirFilmeDiretor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarFilmeDiretor(id)

        if (resultBuscarID.status) {
            let result = await filmeDiretorDAO.deleteFilmeDiretor(id)

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

const excluirDiretoresIdFilme = async function (idFilme) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await filmeDiretorDAO.deleteDiretoresByIdFilme(idFilme)

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
    inserirNovoFilmeDiretor,
    listarFilmeDiretor,
    buscarFilmeDiretor,
    buscarDiretoresIdFilme,
    buscarFilmesIdDiretor,
    atualizarFilmeDiretor,
    excluirFilmeDiretor,
    excluirDiretoresIdFilme
}