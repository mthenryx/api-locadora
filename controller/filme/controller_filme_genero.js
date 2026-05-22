/****************************************************************************************************** 
* Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados
*   para realizar o CRUD de genero
* Data: 22/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const configMessages = require("../modulo/configMessages.js")

const filmeGeneroDAO = require('../../model/DAO/filme_genero/filme_genero.js')

const validarDados = function (filmeGenero) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (filmeGenero.id_filme == undefined || filmeGenero.id_filme == ''   || 
        filmeGenero.id_filme == null      || isNaN(filmeGenero.id_filme) ||
        filmeGenero.id_filme <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST

    } else if (filmeGenero.id_genero == undefined || filmeGenero.id_genero == ''   || 
               filmeGenero.id_genero == null      || isNaN(filmeGenero.id_genero) ||
               filmeGenero.id_genero <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_GENERO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST

    }else {
        return false
    }
}

const inserirNovoFilmeGenero = async function (filmeGenero) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(filmeGenero)

        if (validar) {
            return validar //400
        } else {
            let result = await filmeGeneroDAO.insertFilmeGenero(filmeGenero)

            if (result) { //201
                filmeGenero.id = result

                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                customMessages.DEFAULT_MESSAGE.response = filmeGenero

                return customMessages.DEFAULT_MESSAGE //201
            } else { //erro 500 (Model)
                return customMessages.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const atualizarFilmeGenero = async function (filmeGenero, id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarId = await buscarFilmeGenero(id)

        if (resultBuscarId.status) {

            let validar = await validarDados(filmeGenero)

            if (!validar) {

                filmeGenero.id = id

                let result = await filmeGeneroDAO.updateFilmeGenero(filmeGenero)

                if (result) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = filmeGenero

                    return customMessage.DEFAULT_MESSAGE //200 (Atualizado)
                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                }

            } else {
                return validar //400 de validação dos campos do banco de dados
            }

        } else {
            return resultBuscarId //400(id inválido) ou 404(não encontrado) ou 500
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarFilmeGenero = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await filmeGeneroDAO.selectAllFilmeGenero()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.filme_genero = result

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

const buscarFilmeGenero = async function (id) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o ID seja um número válido
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST // 400
        } else {
            //Chama a função do DAO para pesquisar o filme pelo id
            let result = await filmeGeneroDAO.selectByIdFilmeGenero(id)

            //Validação para verificar se o DAO retornou dados ou um false
            if (result) {
                //Validação para verificar se o DAO tem algum dados no ARRAY
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_genero = result

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

const buscarGeneroIdFilme = async function (idFilme) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o ID seja um número válido
        if (idFilme == undefined || String(idFilme).replaceAll(' ', '') == '' || idFilme == null || isNaN(idFilme) || idFilme < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST // 400
        } else {
            //Chama a função do DAO para pesquisar o filme pelo id
            let result = await filmeGeneroDAO.selectByIdFilmeGenero(idFilme)

            //Validação para verificar se o DAO retornou dados ou um false
            if (result) {
                //Validação para verificar se o DAO tem algum dados no ARRAY
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_genero = result

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

const buscarFilmesIDGenero = async function (idGenero) {

    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o ID seja um número válido
        if (idGenero == undefined || String(idGenero).replaceAll(' ', '') == '' || idGenero == null || isNaN(idGenero) || idGenero < 1) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID_GENERO] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST // 400
        } else {
            //Chama a função do DAO para pesquisar o filme pelo id
            let result = await filmeGeneroDAO.selectFilmesByIdGenero(idGenero)

            //Validação para verificar se o DAO retornou dados ou um false
            if (result) {
                //Validação para verificar se o DAO tem algum dados no ARRAY
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme_genero = result

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

const excluirFilmeGenero = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarId = await buscarFilmeGenero(id)

        if (resultBuscarId.status) {

            let result = await filmeGeneroDAO.deleteFilmeGenero(id)

            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETE_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETE_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETE_ITEM.message

                return customMessage.DEFAULT_MESSAGE //204 (Deletado)
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }

        } else {
            return resultBuscarId //400(id inválido) ou 404(não encontrado) ou 500
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoFilmeGenero,
    atualizarFilmeGenero,
    listarFilmeGenero,
    buscarFilmeGenero,
    excluirFilmeGenero,
    buscarGeneroIdFilme,
    buscarFilmesIDGenero
}