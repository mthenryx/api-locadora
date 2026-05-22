/****************************************************************************************************** 
* Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados
*   para realizar o CRUD de filme
* Data: 17/04/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/
//Import do arquivo de mensagens do projeto
const configMessages = require("../modulo/configMessages.js")

//Import do arquivo do DAO para manipular os dados de filme no Banco de Dados
const filmeDAO = require('../../model/DAO/filme/filme.js')

//Import das controllers
const controllerClassificacao = require('../classificacao/controller_classificacao.js')

const validarDados = async function (filme) {

     //Cria uma copia dos JSON do arquivo de configuração de mensagens
     let customMessage = JSON.parse(JSON.stringify(configMessages))

     if (filme.nome == undefined || filme.nome == '' || filme.nome == null || filme.nome.length > 80) {
          customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
          return customMessage.ERROR_BAD_REQUEST
     } else if (filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null) {
          customMessage.ERROR_BAD_REQUEST.field = '[SINOPSE] INVÁLIDO'
          return customMessage.ERROR_BAD_REQUEST
     } else if (filme.capa == undefined || filme.capa == '' || filme.capa == null || filme.capa.length > 255) {
          customMessage.ERROR_BAD_REQUEST.field = '[CAPA] INVÁLIDO'
          return customMessage.ERROR_BAD_REQUEST
     } else if (filme.data_lancamento == undefined || filme.data_lancamento == '' || filme.data_lancamento == null || filme.data_lancamento.length != 10) {
          customMessage.ERROR_BAD_REQUEST.field = '[DATA DE LANCAMENTO] INVÁLIDO'
          return customMessage.ERROR_BAD_REQUEST
     } else if (filme.duracao == undefined || filme.duracao == '' || filme.duracao == null || filme.duracao.length < 5) {
          customMessage.ERROR_BAD_REQUEST.field = '[DURAÇÃO] INVÁLIDO'
          return customMessage.ERROR_BAD_REQUEST
     } else if (filme.valor == undefined || isNaN(filme.valor) || filme.valor.length > 5) {
          customMessage.ERROR_BAD_REQUEST.field = '[VALOR] INVÁLIDO'
          return customMessage.ERROR_BAD_REQUEST
     } else if (filme.avaliacao == undefined || isNaN(filme.avaliacao) || filme.avaliacao.length > 3) {
          customMessage.ERROR_BAD_REQUEST.field = '[AVALIAÇÃO] INVÁLIDO'
          return customMessage.ERROR_BAD_REQUEST

     //Validação para FK da classificacao
     } else if (filme.id_classificacao == undefined || filme.id_classificacao == '' || filme.id_classificacao == null || isNaN(filme.id_classificacao) || filme.id_classificacao <= 0) {
          customMessage.ERROR_BAD_REQUEST.field = '[ID_CLASSIFICAÇÃO] INVÁLIDO'
          return customMessage.ERROR_BAD_REQUEST
     } else {
          return false
     }
}

//Função para tratar os dados a serem inseridos
const tratarDados = function(filme){
     //Tratamento para eliminar a chegada da aspas (') como caracter inválido
     filme.nome             = filme.nome.replaceAll("'", "")
     filme.sinopse          = filme.sinopse.replaceAll("'", "")
     filme.capa             = filme.capa.replaceAll("'", "")
     filme.data_lancamento  = filme.data_lancamento.replaceAll("'", "")
     filme.duracao          = filme.duracao.replaceAll("'", "")
     filme.valor            = filme.valor.replaceAll("'", "")
     filme.avaliacao        = filme.avaliacao.replaceAll("'", "")

     return filme
}

//Funçao para inserir um novo filme 
const inserirNovoFilme = async function (filme, contentType) {

     let customMessages = JSON.parse(JSON.stringify(configMessages))

     try {
          if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {

               let validar = await validarDados(filme)
               //Returna um JSON de error caso algum atributo seja inválido,
               //senão retorna um false (Não teve erro)
               if (validar) {
                    return validar //400
               } else {
                    let result = await filmeDAO.insertFilme(await tratarDados(filme))

                    if (result) { //201
                         //Cria o ID no Json do filme e adiciona o Id gerado
                         filme.id = result 

                         customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                         customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                         customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
                         customMessages.DEFAULT_MESSAGE.response = filme

                         return customMessages.DEFAULT_MESSAGE //201
                    } else { //erro 500 (Model)
                         return customMessages.ERROR_INTERNAL_SERVER_MODEL //500
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

     let customMessage = JSON.parse(JSON.stringify(configMessages))

     try {
          //Validação para verificar se o conteúdo do body é um json
          if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
               //Chama a função para buscar o filme e válidar se o ID esta correto,
               //Se o Id existe no BD e se o Filme existe
               let resultBuscarFilme = await buscarFilme(id)

               if (resultBuscarFilme.status) {
                    //Chama a função para validar os dados para a alteração dos dados do filme
                    let validar = await validarDados(filme)

                    if (!validar) {
                         //Adiciona um atributo ID no JSON de filmes, para enviar ao DAO um único objeto
                         filme.id = Number(id)
                         //Chama a função para atualizar o filme no BD
                         let result = await filmeDAO.updateFilme(await tratarDados(filme))

                         if (result) {
                              customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                              customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                              customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                              customMessage.DEFAULT_MESSAGE.response = filme

                              return customMessage.DEFAULT_MESSAGE //200 (Atualizado)
                         } else {
                              return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                         }

                    } else {
                         return validar //400 de validação dos campos do banco de dados
                    }

               } else {
                    return resultBuscarFilme //400(id inválido) ou 404(não encontrado) ou 500
               }

          } else {
               return customMessage.ERROR_CONTENT_TYPE //415
          }

     } catch (error) {
          return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
     }
}

//Função para retonar todos os filmes existentes
const listarFilme = async function () {

     let customMessages = JSON.parse(JSON.stringify(configMessages))

     try {
          //Chama a função do DAO para retornar a lista de filmes do BD
          let result = await filmeDAO.selectAllFilme()

          //Validação para verificar se o DAO conseguiu processar o script no banco de dados
          if (result) {
               //Validação para verificar se o conteúdo do array tem dados de retorno 
               //OU se esta vasio
               if (result.length > 0) {

                    //Manipulação dos dados da Classificação
                    //Percorre o array de filmes 
                    for (filme of result) {
                         //Busca na controller da classificação o id referente a FK da classificação
                         let resultClassificacao = await controllerClassificacao.buscarClassificacaoId(filme.id_classificacao)

                         //Se encontrar o ID
                         if(resultClassificacao.status){
                              //Adicionar um atributo classificação no JSON do filme e colocar o resultado com dados da classificação
                              filme.classificacao = resultClassificacao.response.classificacao
                              //Apaga o id_classificao do JSON de filme
                              delete filme.id_classificacao
                         }
                    }

                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.count = result.length
                    customMessages.DEFAULT_MESSAGE.response.filme = result

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

//Função para retornar um filme filtrando pelo id
const buscarFilme = async function (id) {

     let customMessages = JSON.parse(JSON.stringify(configMessages))

     try {
          //Validação para garantir que o ID seja um número válido
          if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id < 1) {
               customMessages.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
               return customMessages.ERROR_BAD_REQUEST // 400
          } else {
               //Chama a função do DAO para pesquisar o filme pelo id
               let result = await filmeDAO.selectByIdFilme(id)

               //Validação para verificar se o DAO retornou dados ou um false
               if (result) {
                    //Manipulação dos dados da Classificação
                    //Percorre o array de filmes 
                    for (filme of result) {
                         //Busca na controller da classificação o id referente a FK da classificação
                         let resultClassificacao = await controllerClassificacao.buscarClassificacaoId(filme.id_classificacao)

                         //Se encontrar o ID
                         if(resultClassificacao.status){
                              //Adicionar um atributo classificação no JSON do filme e colocar o resultado com dados da classificação
                              filme.classificacao = resultClassificacao.response.classificacao
                              //Apaga o id_classificao do JSON de filme
                              delete filme.id_classificacao
                         }
                    }

                    //Validação para verificar se o DAO tem algum dados no ARRAY
                    if (result.length > 0) {
                         customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                         customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                         customMessages.DEFAULT_MESSAGE.response.filme = result

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

//Função para excluir um filme
const excluirFilme = async function (id) {

     let customMessage = JSON.parse(JSON.stringify(configMessages))

     try {
          //Chama a função para buscar o filme e válidar se o ID esta correto,
          //Se o Id existe no BD e se o Filme existe
          let resultBuscarFilme = await buscarFilme(id)

          if (resultBuscarFilme.status) {
               //Chama a função para deletar o filme no BD
               let result = await filmeDAO.deleteFilme(id)

               if (result) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETE_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETE_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETE_ITEM.message

                    return customMessage.DEFAULT_MESSAGE //204 (Deletado)
               } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
               }
          } else {
               return resultBuscarFilme //400(id inválido) ou 404(não encontrado) ou 500
          }
     } catch (error) {
          return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
     }
}

module.exports = {
     inserirNovoFilme,
     atualizarFilme,
     listarFilme,
     buscarFilme,
     excluirFilme
}