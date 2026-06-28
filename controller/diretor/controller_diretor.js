const configMessages = require('../modulo/configMessages.js')

const diretorDAO = require('../../model/DAO/diretor/diretor.js')

const controllerSexo = require('../sexo/controller_sexo.js')
const controllerNacionalidade = require('../nacionalidade/controller_nacionalidade.js')
const controllerFotoDiretor = require('./controller_foto_diretor.js')
const controllerAtividadeDiretor = require('./controller_atividade_diretor.js')
const controllerFilmeDiretor = require('../filme/controller_filme_diretor.js')

const validarDados = async function (diretor) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (diretor.nome == undefined || diretor.nome == '' || diretor.nome == null || diretor.nome.length > 100) {
        customMessages.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
    } else if (diretor.data_nascimento == undefined || diretor.data_nascimento == '' || diretor.data_nascimento == null || diretor.data_nascimento.length != 10) {
        customMessages.ERROR_BAD_REQUEST.field = '[DATA DE NASCIMENTO] INVÁLIDO'
    } else if (diretor.biografia == undefined) {
        customMessages.ERROR_BAD_REQUEST.field = '[BIOGRAFIA] INVÁLIDO'
    } else if (diretor.id_sexo_diretor == undefined || diretor.id_sexo_diretor == '' || diretor.id_sexo_diretor == null || diretor.id_sexo_diretor < 1 || isNaN(diretor.id_sexo_diretor)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID DE SEXO] INVÁLIDO'
    } else if (diretor.id_nacionalidade_diretor == undefined || diretor.id_nacionalidade_diretor == '' || diretor.id_nacionalidade_diretor == null || diretor.id_nacionalidade_diretor < 1 || isNaN(diretor.id_nacionalidade_diretor)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID DE NACIONALIDADE] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const tratarDados = async function (diretor) {
    diretor.nome = diretor.nome.replaceAll("'", "")
    diretor.data_nascimento = diretor.data_nascimento.replaceAll("'", "")
    diretor.biografia = diretor.biografia.replaceAll("'", "")

    return diretor
}

const inserirNovoDiretor = async function (diretor, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validacao = await validarDados(diretor)

            if (validacao)
                return validacao //400
            else { //200
                let result = await diretorDAO.insertDiretor(await tratarDados(diretor))

                if (result) {
                    diretor.id = result

                    for (let itemDiretor of diretor.foto) {
                        let fotoDiretor = {
                            "id_diretor": diretor.id,
                            "id_foto": itemDiretor.id
                        }

                        let resultFotoDiretor = await controllerFotoDiretor.inserirNovaFotoDiretor(fotoDiretor)

                        if (!resultFotoDiretor.status) {
                            return customMessages.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    for (let itemDiretor of diretor.atividade) {
                        let atividadeDiretor = {
                            "id_diretor": diretor.id,
                            "id_atividade": itemDiretor.id
                        }

                        let resultAtividadeDiretor = await controllerAtividadeDiretor
                            .inserirNovaAtividadeDiretor(atividadeDiretor)

                        if (!resultAtividadeDiretor.status)
                            return customMessages.SUCCESS_CREATED_ITEM_WARNING
                    }

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = diretor

                    return customMessages.DEFAULT_MESSAGE //201
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }

}

const atualizarDiretor = async function (diretor, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarDiretor = await buscarDiretor(id)

            if (resultBuscarDiretor.status) {
                let validar = await validarDados(diretor)

                if (!validar) {
                    diretor.id = Number(id)

                    let result = await diretorDAO.updateDiretor(await tratarDados(diretor))

                    if (result) {
                        let resultDeleteFotos = await controllerFotoDiretor.excluirFotosIdDiretor(diretor.id)

                        if (resultDeleteFotos.status) {
                            for (let itemDiretor of diretor.foto) {
                                let fotoDiretor = {
                                    "id_diretor": diretor.id,
                                    "id_foto": itemDiretor.id
                                }

                                let resultFotoDiretor = await controllerFotoDiretor.inserirNovaFotoDiretor(fotoDiretor)

                                if (!resultFotoDiretor.status) {
                                    return customMessages.SUCCESS_CREATED_ITEM_WARNING
                                }
                            }
                        }

                        let resultDeleteAtividades = await controllerAtividadeDiretor.excluirAtividadesIdDiretor(diretor.id)

                        if (resultDeleteAtividades.status) {
                            for (let itemDiretor of diretor.atividade) {
                                let atividadeDiretor = {
                                    "id_diretor": diretor.id,
                                    "id_atividade": itemDiretor.id
                                }

                                let resultAtividadeDiretor = await controllerAtividadeDiretor
                                    .inserirNovaAtividadeDiretor(atividadeDiretor)

                                if (!resultAtividadeDiretor.status)
                                    return customMessages.SUCCESS_CREATED_ITEM_WARNING
                            }
                        }

                        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response = diretor

                        return customMessages.DEFAULT_MESSAGE //200
                    } else {
                        return customMessages.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                    }
                } else {
                    return validar //400
                }
            } else {
                return resultBuscarDiretor //400, 404 ou 500
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const listarDiretor = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await diretorDAO.selectAllDiretor()

        if (result) {
            if (result.length > 0) {

                for (let diretor of result) {

                    let resultSexo = await controllerSexo.buscarSexo(diretor.id_sexo_diretor)

                    if (resultSexo.status) {
                        diretor.sexo = resultSexo.response.sexo
                        diretor.sigla = resultSexo.response.sigla
                        delete diretor.id_sexo_diretor
                    }

                    let resultNacionalidade = await controllerNacionalidade.buscarNacionalidade(diretor.id_nacionalidade_diretor)

                    if (resultNacionalidade.status) {
                        diretor.nacionalidade = resultNacionalidade.response.nacionalidade
                        diretor.sigla = resultNacionalidade.response.sigla
                        delete diretor.id_nacionalidade_diretor
                    }

                    let resultFotoDiretor = await controllerFotoDiretor.buscarFotosIdDiretor(diretor.id)

                    if (resultFotoDiretor.status) {
                        diretor.foto = resultFotoDiretor.response.foto_diretor
                    }

                    let resultAtividadeDiretor = await controllerAtividadeDiretor
                        .buscarAtividadesIdDiretor(diretor.id)

                    if (resultAtividadeDiretor.status) {
                        diretor.atividade = resultAtividadeDiretor.response.atividade_diretor
                    }

                    let resultFIlmeDiretor = await controllerFilmeDiretor
                        .buscarFilmesIdDiretor(diretor.id)

                    if (resultFIlmeDiretor.status) {
                        diretor.filme = resultFIlmeDiretor.response.filme_diretor
                    }
                }

                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.diretor = result

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_NOT_FOUND //404
            }
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL //500 (model)
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const buscarDiretor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await diretorDAO.selectByIdDiretor(id)

            if (result) {
                if (result.length > 0) {

                    for (let diretor of result) {

                        let resultSexo = await controllerSexo.buscarSexo(diretor.id_sexo_diretor)

                        if (resultSexo.status) {
                            diretor.sexo = resultSexo.response.sexo
                            diretor.sigla = resultSexo.response.sigla
                            delete diretor.id_sexo_diretor
                        }

                        let resultNacionalidade = await controllerNacionalidade.buscarNacionalidade(diretor.id_nacionalidade_diretor)

                        if (resultNacionalidade.status) {
                            diretor.nacionalidade = resultNacionalidade.response.nacionalidade
                            diretor.sigla = resultNacionalidade.response.sigla
                            delete diretor.id_nacionalidade_diretor
                        }

                        let resultFotoDiretor = await controllerFotoDiretor.buscarFotosIdDiretor(diretor.id)

                        if (resultFotoDiretor.status)
                            diretor.foto = resultFotoDiretor.response.foto_diretor

                        let resultAtividadeDiretor = await controllerAtividadeDiretor
                            .buscarAtividadesIdDiretor(diretor.id)

                        if (resultAtividadeDiretor.status)
                            diretor.atividade = resultAtividadeDiretor.response.atividade_diretor

                        let resultFIlmeDiretor = await controllerFilmeDiretor
                            .buscarFilmesIdDiretor(diretor.id)

                        if (resultFIlmeDiretor.status)
                            diretor.filme = resultFIlmeDiretor.response.filme_diretor
                    }

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.diretor = result

                    return customMessages.DEFAULT_MESSAGE //200
                } else {
                    return customMessages.ERROR_NOT_FOUND //404
                }
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const excluirDiretor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarDiretor = await buscarDiretor(id)

        if (resultBuscarDiretor.status) {
            let result = await diretorDAO.deleteDiretor(id)

            if (result) {
                return customMessages.SUCCESS_DELETE_ITEM //204
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        } else {
            return resultBuscarDiretor //400 ou 404
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

module.exports = {
    inserirNovoDiretor,
    atualizarDiretor,
    listarDiretor,
    buscarDiretor,
    excluirDiretor
}