const configMessages = require('../modulo/configMessages.js')

const atorDAO = require('../../model/DAO/ator/ator.js')

const controllerSexo            = require('../sexo/controller_sexo.js')
const controllerNacionalidade   = require('../nacionalidade/controller_nacionalidade.js')
const controllerFotoAtor        = require('./controller_foto_ator.js')
const controllerAtividadeAtor   = require('./controller_atividade_ator.js')
const controllerFilmeAtor       = require('../filme/controller_filme_ator.js')

const validarDados = async function (ator) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (ator.nome == undefined || ator.nome == '' || ator.nome == null || ator.nome.length > 100) {
        customMessages.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
    } else if (ator.data_nascimento == undefined || ator.data_nascimento == '' || ator.data_nascimento == null || ator.data_nascimento.length != 10) {
        customMessages.ERROR_BAD_REQUEST.field = '[DATA DE NASCIMENTO] INVÁLIDO'
    } else if (ator.biografia == undefined) {
        customMessages.ERROR_BAD_REQUEST.field = '[BIOGRAFIA] INVÁLIDO'
    } else if (ator.id_sexo_ator == undefined || ator.id_sexo_ator == '' || ator.id_sexo_ator == null || ator.id_sexo_ator < 1 || isNaN(ator.id_sexo_ator)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID DE SEXO] INVÁLIDO'
    } else if (ator.id_nacionalidade_ator == undefined || ator.id_nacionalidade_ator == '' || ator.id_nacionalidade_ator == null || ator.id_nacionalidade_ator < 1 || isNaN(ator.id_nacionalidade_ator)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID DE NACIONALIDADE] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

const tratarDados = async function (ator) {
    ator.nome               = ator.nome.replaceAll("'", "")
    ator.data_nascimento    = ator.data_nascimento.replaceAll("'", "")
    ator.biografia          = ator.biografia.replaceAll("'", "")

    return ator
}

const inserirNovoAtor = async function (ator, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validacao = await validarDados(ator)

            if (validacao)
                return validacao //400
            else { //200
                let result = await atorDAO.insertAtor(await tratarDados(ator))

                if (result) {
                    ator.id = result

                    for (let itemAtor of ator.foto) {
                        let fotoAtor = {
                            "id_ator": ator.id,
                            "id_foto": itemAtor.id
                        }

                        let resultFotoAtor = await controllerFotoAtor.inserirNovaFotoAtor(fotoAtor)

                        if (!resultFotoAtor.status) {
                            return customMessages.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    for (let itemAtor of ator.atividade) {
                        let atividadeAtor = {
                            "id_ator": ator.id,
                            "id_atividade": itemAtor.id
                        }

                        let resultAtividadeAtor = await controllerAtividadeAtor
                                                        .inserirNovaAtividadeAtor(atividadeAtor)

                        if (!resultAtividadeAtor.status)
                            return customMessages.SUCCESS_CREATED_ITEM_WARNING
                    }

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = ator

                    return customMessages.DEFAULT_MESSAGE //201
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const atualizarAtor = async function (ator, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarAtor = await buscarAtor(id)

            if (resultBuscarAtor.status) {
                let validar = await validarDados(ator)

                if (!validar) {
                    ator.id = Number(id)

                    let result = await atorDAO.updateAtor(await tratarDados(ator))

                    if (result) {
                        let resultDeleteFotos = await controllerFotoAtor.excluirFotosIdAtor(ator.id)

                        if (resultDeleteFotos.status) {
                            for (let itemAtor of ator.foto) {
                                let fotoAtor = {
                                    "id_ator": ator.id,
                                    "id_foto": itemAtor.id
                                }

                                let resultFotoAtor = await controllerFotoAtor.inserirNovaFotoAtor(fotoAtor)

                                if (!resultFotoAtor.status) {
                                    return customMessages.SUCCESS_CREATED_ITEM_WARNING //201 com alerta
                                }
                            }

                            
                        }
                        
                        let resultDeleteAtividades = await controllerAtividadeAtor.excluirAtividadesIdAtor(ator.id)

                        if (resultDeleteAtividades.status) {
                            for (let itemAtor of ator.atividade) {
                                let atividadeAtor = {
                                    "id_ator": ator.id,
                                    "id_atividade": itemAtor.id
                                }

                                let resultAtividadeAtor = await controllerAtividadeAtor
                                                                .inserirNovaAtividadeAtor(atividadeAtor)

                                if (!resultAtividadeAtor.status)
                                    return customMessages.SUCCESS_CREATED_ITEM_WARNING
                            }
                        }

                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = ator

                        return customMessages.DEFAULT_MESSAGE //200
                    } else {
                        return customMessages.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validar //400
                }
            } else {
                return resultBuscarAtor 
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const listarAtor = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await atorDAO.selectAllAtor()

        if (result) {
            if (result.length > 0) {

                for (let ator of result) {
                    let resultSexo = await controllerSexo.buscarSexo(ator.id_sexo_ator)

                    if (resultSexo.status) {
                        ator.sexo = resultSexo.response.sexo
                        ator.sigla = resultSexo.response.sigla

                        delete ator.id_sexo_ator
                    }

                    let resultNacionalidade = await controllerNacionalidade.buscarNacionalidade(ator.id_nacionalidade_ator)

                    if (resultNacionalidade.status) {
                        ator.nacionalidade = resultNacionalidade.response.nacionalidade
                        ator.sigla = resultNacionalidade.response.sigla

                        delete ator.id_nacionalidade_ator
                    }

                    let resultFotoAtor = await controllerFotoAtor.buscarFotosIdAtor(ator.id)

                    if (resultFotoAtor.status)
                        ator.foto = resultFotoAtor.response.foto_ator

                    let resultAtividadeAtor = await controllerAtividadeAtor.buscarAtividadesIdAtor(ator.id)

                    if (resultAtividadeAtor.status)
                        ator.atividade = resultAtividadeAtor.response.atividade_ator

                    let resultFilmeAtor = await controllerFilmeAtor.buscarFilmesIdAtores(ator.id)

                    if (resultFilmeAtor.status)
                        ator.filme = resultFilmeAtor.response.filme_ator
                }

                customMessages.DEFAULT_MESSAGE.status           = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code      = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count   = result.length
                customMessages.DEFAULT_MESSAGE.response.ator    = result

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

const buscarAtor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            let result = await atorDAO.selectByIdAtor(id)

            if (result) {
                if (result.length > 0) {
                    for (let ator of result) {
                        let resultSexo = await controllerSexo.buscarSexo(ator.id_sexo_ator)

                        if (resultSexo.status) {
                            ator.sexo = resultSexo.response.sexo
                            ator.sigla = resultSexo.response.sigla

                            delete ator.id_sexo_ator
                        }

                        let resultNacionalidade = await controllerNacionalidade.buscarNacionalidade(ator.id_nacionalidade_ator)

                        if (resultNacionalidade.status) {
                            ator.nacionalidade = resultNacionalidade.response.nacionalidade
                            ator.sigla = resultNacionalidade.response.sigla

                            delete ator.id_nacionalidade_ator
                        }

                        let resultFotoAtor = await controllerFotoAtor.buscarFotosIdAtor(ator.id)

                        if (resultFotoAtor.status)
                            ator.foto = resultFotoAtor.response.foto_ator

                        let resultAtividadeAtor = await controllerAtividadeAtor.buscarAtividadesIdAtor(ator.id)

                        if (resultAtividadeAtor.status)
                            ator.atividade = resultAtividadeAtor.response.atividade_ator

                        let resultFilmeAtor = await controllerFilmeAtor.buscarFilmesIdAtores(ator.id)

                        if (resultFilmeAtor.status)
                            ator.filme = resultFilmeAtor.response.filme_ator
                    }

                    customMessages.DEFAULT_MESSAGE.status           = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code      = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.ator    = result

                    return customMessages.DEFAULT_MESSAGE //200
                } else {
                    return customMessages.ERROR_NOT_FOUND //404
                }
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirAtor = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarAtor = await buscarAtor(id)

        if (resultBuscarAtor.status) {
            let result = await atorDAO.deleteAtor(id)

            if (result) {
                return customMessages.SUCCESS_DELETE_ITEM //204
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return resultBuscarAtor //400 ou 404
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = {
    inserirNovoAtor,
    atualizarAtor,
    listarAtor,
    buscarAtor,
    excluirAtor
}