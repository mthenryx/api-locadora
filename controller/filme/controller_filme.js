/****************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD de filme
 * data_lancamento: 17/04/2026
 * Autor: Matheus Henry dos Santos
 * Versão: 1.0
*****************************************************************************************************************/

//Import do arquivo de configurações de mensagens do projeto
const configMessages = require('../modulo/configMessages.js')

//Import do arquivo do DAO para manipular os dados de filme no banco de dados
const filmeDAO = require('../../model/DAO/filme/filme.js')

//Import das Controllers
const controllerClassificacao   = require('../classificacao/controller_classificacao.js')
const controllerFilmeGenero     = require('./controller_filme_genero.js')
const controllerFilmeDiretor    = require('./controller_filme_diretor.js')
const controllerFilmeAtor       = require('./controller_filme_ator.js')

//Função para validar os dados de cadastro do filme
const validarDados = async function (filme) {
    //Cria uma cópia dos JSON do arquivo de configuração de mensagens
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (filme.nome == undefined || filme.nome == '' || filme.nome == null || filme.nome.length > 80) {
        customMessages.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
    } else if (filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null) {
        customMessages.ERROR_BAD_REQUEST.field = '[SINOPSE] INVÁLIDO'
    } else if (filme.capa == undefined || filme.capa == '' || filme.capa == null || filme.capa.length > 255) {
        customMessages.ERROR_BAD_REQUEST.field = '[CAPA] INVÁLIDO'
    } else if (filme.data_lancamento == undefined || filme.data_lancamento == '' || filme.data_lancamento == null || filme.data_lancamento.length != 10) {
        customMessages.ERROR_BAD_REQUEST.field = '[DATA DE LANÇAMENTO] INVÁLIDO'
    } else if (filme.duracao == undefined || filme.duracao == '' || filme.duracao == null || filme.duracao < 5) {
        customMessages.ERROR_BAD_REQUEST.field = '[DURAÇÃO] INVÁLIDO'
    } else if (filme.valor == undefined || isNaN(filme.valor) || filme.valor.length > 5) {
        customMessages.ERROR_BAD_REQUEST.field = '[VALOR] INVÁLIDO'
    } else if (filme.avaliacao == undefined || isNaN(filme.avaliacao) || filme.avaliacao.length > 3) {
        customMessages.ERROR_BAD_REQUEST.field = '[AVALIAÇÃO] INVÁLIDO'
        //Validação de chave estrangeira (classificação)
    } else if (filme.id_classificacao == undefined || filme.id_classificacao == '' || filme.id_classificacao == null || filme.id_classificacao < 1 || isNaN(filme.id_classificacao)) {
        customMessages.ERROR_BAD_REQUEST.field = '[ID DE CLASSIFICAÇÃO] INVÁLIDO'
    } else {
        return false
    }

    return customMessages.ERROR_BAD_REQUEST
}

//Função para tratar os dados a serem inseridos
const tratarDados = async function (filme) {
    //Tratamento para eliminar a chegada da aspas (') como caracter inválido
    filme.nome              = filme.nome.replaceAll("'", "")
    filme.sinopse           = filme.sinopse.replaceAll("'", "")
    filme.capa              = filme.capa.replaceAll("'", "")
    filme.data_lancamento   = filme.data_lancamento.replaceAll("'", "")
    filme.duracao           = filme.duracao.replaceAll("'", "")
    filme.valor             = filme.valor.replaceAll("'", "")
    filme.avaliacao         = filme.avaliacao.replaceAll("'", "")

    return filme
}

//Função para inserir um novo filme
const inserirNovoFilme = async function (filme, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            //Chama a função para validar a entrada dos dados do filme
            let validacao = await validarDados(filme)

            //Retorna um JSON de erro caso algum atributo seja inválido, se não, retorna um false (Não teve erro)
            if (validacao)
                return validacao //400
            else { //200

                //Encaminha os dados do filme para o DAO inserir no Banco de Dados
                let result = await filmeDAO.insertFilme(await tratarDados(filme))

                if (result) {
                    //Cria o ID no Json do filme e adiciona o ID gerado
                    filme.id = result

                    //Manipulação de dados para inserir os generos relacionados ao Filme
                    //Percorre o ARRAY de generos que chegará na requisição pelo objeto Filme
                    for (let itemFilme of filme.genero) {
                        let filmeGenero = {
                            "id_filme": filme.id,
                            "id_genero": itemFilme.id
                        }

                        let resulFilmeGenero = await controllerFilmeGenero
                                                        .inserirNovoFilmeGenero(filmeGenero)

                        if (!resulFilmeGenero.status) {
                            return customMessages.SUCCESS_CREATED_ITEM_WARNING //201 com alerta de cadastro
                        }
                    }

                    for (let itemFilme of filme.diretor) {
                        let filmeDiretor = {
                            "id_filme": filme.id,
                            "id_diretor": itemFilme.id
                        }

                        let resultFilmeDiretor = await controllerFilmeDiretor
                                                        .inserirNovoFilmeDiretor(filmeDiretor)

                        if (!resultFilmeDiretor.status)
                            return customMessages.SUCCESS_CREATED_ITEM_WARNING
                    }

                    for (let itemFilme of filme.ator) {
                        let filmeAtor = {
                            "id_filme": filme.id,
                            "id_ator": itemFilme.id
                        }

                        let resultFilmeAtor = await controllerFilmeAtor
                                                        .inserirNovoFilmeAtor(filmeAtor)

                        if (!resultFilmeAtor.status)
                            return customMessages.SUCCESS_CREATED_ITEM_WARNING
                    }

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = filme

                    return customMessages.DEFAULT_MESSAGE //201
                } else { //erro 500 (model)
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

//Função para atualizar um filme existente
const atualizarFilme = async function (filme, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para verificar se o conteúdo do Body é um JSON
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            //Chama a função para buscar o filme e validar se o ID está correto
            //Se o ID existe no BD e se o Filme existe
            let resultBuscarFilme = await buscarFilme(id)

            if (resultBuscarFilme.status) {
                //Chama a função para validar os dados para alteração do filme (Body)
                let validar = await validarDados(filme)

                if (!validar) {
                    //Adiciona um atributo ID no JSON de filme, para enviar ao DAO um único objeto
                    filme.id = Number(id)

                    //Chama a função para atualizar o filme no Banco de Dados
                    let result = await filmeDAO.updateFilme(await tratarDados(filme))

                    if (result) {
                        //Exluir as relações entre o Filme e os Generos (Tabela de relação)
                        let resultDeleteGeneros = await controllerFilmeGenero.excluirGenerosIdFilme(filme.id)

                        if (resultDeleteGeneros.status) {
                            //Manipulação de dados para inserir os generos relacionados ao Filme
                            //Percorre o ARRAY de generos que chegará na requisição pelo objeto Filme
                            for (let itemFilme of filme.genero) {
                                let filmeGenero = {
                                    "id_filme": filme.id,
                                    "id_genero": itemFilme.id
                                }

                                let resulFilmeGenero = await controllerFilmeGenero
                                                                .inserirNovoFilmeGenero(filmeGenero)

                                if (!resulFilmeGenero.status) {
                                    return customMessages.SUCCESS_CREATED_ITEM_WARNING //201 com alerta de cadastro
                                }
                            }
                        }

                        let resultDeleteDiretores = await controllerFilmeDiretor
                                                            .excluirDiretoresIdFilme(filme.id)

                        if (resultDeleteDiretores.status) {
                            for (let itemFilme of filme.diretor) {
                                let filmeDiretor = {
                                    "id_filme": filme.id,
                                    "id_diretor": itemFilme.id
                                }

                                let resultFilmeDiretor = await controllerFilmeDiretor
                                                                .inserirNovoFilmeDiretor(filmeDiretor)

                                if (!resultFilmeDiretor.status)
                                    return customMessages.SUCCESS_CREATED_ITEM_WARNING
                            }
                        }

                        let resultDeleteAtores = await controllerFilmeAtor
                                                        .excluirAtoresIdFilme(filme.id)

                        if (resultDeleteAtores.status) {
                            for (let itemFilme of filme.ator) {
                                let filmeAtor = {
                                    "id_filme": filme.id,
                                    "id_ator": itemFilme.id
                                }

                                let resultFilmeAtor = await controllerFilmeAtor
                                                                .inserirNovoFilmeAtor(filmeAtor)

                                if (!resultFilmeAtor.status)
                                    return customMessages.SUCCESS_CREATED_ITEM_WARNING
                            }
                        }

                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = filme

                        return customMessages.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return customMessages.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                    }
                } else {
                    return validar //400 de validação dos campos do banco de dados
                }
            } else {
                return resultBuscarFilme //400 (ID inválido) ou 404 (não encontrado) ou 500
            }
        } else {
            return customMessages.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para retornar todos os filmes existentes
const listarFilme = async function () {
    //Cria uma cópia dos JSON do arquivo de configuração de mensagens
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Chama a função do DAO para retornar a lista de filmes do Banco de Dados
        let result = await filmeDAO.selectAllFilme()

        //Validação para verificar se o DAO conseguiu processar o script no Banco de Dados
        if (result) {
            //Validação para verificar se o conteúdo do array tem dados de retorno ou se está vazio
            if (result.length > 0) {
                // Manipulação dos dados da classificação
                // Percorre o array de filmes
                for (let filme of result) {
                    // Busca na controller da classificação o id referente à FK da classificação
                    let resultClassificacao = await controllerClassificacao.buscarClassificacao(filme.id_classificacao)

                    // Se encontrar o id
                    if (resultClassificacao.status) {
                        // Adiciona um atributo classificação no JSON do filme e coloca o resultado com os dados da mesma
                        filme.classificacao = resultClassificacao.response.classificacao

                        // Apaga o atributo id_classificacao do JSON de filme
                        delete filme.id_classificacao
                    }

                    let resultFilmeGenero = await controllerFilmeGenero.buscarGenerosIdFilme(filme.id)

                    if (resultFilmeGenero.status) {
                        filme.genero = resultFilmeGenero.response.filme_genero
                    }

                    let resultFilmeDiretor = await controllerFilmeDiretor.buscarDiretoresIdFilme(filme.id)

                    if (resultFilmeDiretor.status)
                        filme.diretor = resultFilmeDiretor.response.filme_diretor

                    let resultFilmeAtor = await controllerFilmeAtor.buscarAtoresIdFilme(filme.id)

                    if (resultFilmeAtor.status)
                        filme.ator = resultFilmeAtor.response.filme_ator
                }

                customMessages.DEFAULT_MESSAGE.status           = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code      = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count   = result.length
                customMessages.DEFAULT_MESSAGE.response.filme   = result

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

//Função para retornar um filme filtrando pelo id
const buscarFilme = async function (id) {
    //Cria uma cópia dos JSON do arquivo de configuração de mensagens
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Validação para garantir que o ID seja um número valido
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return customMessages.ERROR_BAD_REQUEST //400
        } else {
            //Chama a função do DAO para pesquisar o filme pelo ID
            let result = await filmeDAO.selectByIdFilme(id)

            //Validação para verificar se o DAO retornou dados ou um FALSE (erro)
            if (result) {
                //Validação para verificar se o DAO tem algum dado no Array
                if (result.length > 0) {
                    // Manipulação dos dados da classificação
                    // Percorre o array de filmes
                    for (let filme of result) {
                        // Busca na controller da classificação o id referente à FK da classificação
                        let resultClassificacao = await controllerClassificacao.buscarClassificacao(filme.id_classificacao)

                        // Se encontrar o id
                        if (resultClassificacao.status) {
                            // Adiciona um atributo classificação no JSON do filme e coloca o resultado com os dados da mesma
                            filme.classificacao = resultClassificacao.response.classificacao
                            // Apaga o atributo id_classificacao do JSON de filme
                            delete filme.id_classificacao
                        }

                        let resultFilmeGenero = await controllerFilmeGenero.buscarGenerosIdFilme(filme.id)

                        if (resultFilmeGenero.status) {
                            filme.genero = resultFilmeGenero.response.filme_genero
                        }

                        let resultFilmeDiretor = await controllerFilmeDiretor.buscarDiretoresIdFilme(filme.id)

                        if (resultFilmeDiretor.status) 
                            filme.diretor = resultFilmeDiretor.response.filme_diretor

                        let resultFilmeAtor = await controllerFilmeAtor.buscarAtoresIdFilme(filme.id)

                        if (resultFilmeAtor.status)
                            filme.ator = resultFilmeAtor.response.filme_ator
                    }

                    customMessages.DEFAULT_MESSAGE.status           = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code      = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.filme   = result

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

//Função para excluir um filme
const excluirFilme = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        //Chama a função de buscar filme para validar se o filme existe
        let resultBuscarFilme = await buscarFilme(id)

        if (resultBuscarFilme.status) {
            //Chama a função do DAO para excluir um filme
            let result = await filmeDAO.deleteFilme(id)

            if (result) {
                return customMessages.SUCCESS_DELETE_ITEM //204 (delete)
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        } else {
            return resultBuscarFilme //400 (ID inválido) ou 404 (não encontrado)
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

module.exports = {
    inserirNovoFilme,
    atualizarFilme,
    listarFilme,
    buscarFilme,
    excluirFilme
}