/******************************************************************************************
 * Objetivo: Arquivo responsavel pela padronização das mensagens e status code 
 *  do projeto de filmes
 * Data: 17/04/2026
 * Autor: Matheus
 * Versão: 1.0
 *******************************************************************************************/

//Padronização dos retornos da API (Cabeçalho)
const DEFAULT_MESSAGE = {
    api_descripition: 'API para controlar projeto de Filmes',
    development: 'Matheus Henry dos Santos',
    version: '1.0.4.26',
    status: Boolean,
    status_code: Number,
    response: {}
}

//Mensagem de ERRO do projeto de filmes
const ERROR_BAD_REQUEST                 = {status: false, status_code: 400, message: 'Não foi possivel processar a requisição devido a erros de entrada de dados.'}
const ERROR_INTERNAL_SERVER_MODEL       = {status: false, status_code:500, message: 'Não foi possível processar a requisição devido a um erro interno no servidor [MODEL]'}
const ERROR_INTERNAL_SERVER_CONTROLLER  = {status: false, status_code:500, message: 'Não foi possível processar a requisição devido a um erro interno no servidor [CONTROLLER]'}
const ERROR_NOT_FOUND                   = {status: false, status_code:404, message: 'Não foram encontrados dados para retorno.'}
const ERROR_CONTENT_TYPE                = {status: false, status_code:415, message: 'Não foi possivel realizar a requisição, pois o formato de dados encaminhado não é suportados pelo, servidor, apenas deve ser utilizado JSON.'}

//Mensagens de SUCESSO do projeto de filmes
const SUCCESS_CREATED_ITEM  = {status: true, status_code: 201, message: 'Item inserido com sucesso'}
const SUCCESS_RESPONSE      = {status: true, status_code: 200}
const SUCCESS_UPDATED_ITEM  = {status: true, status_code: 200, message: 'Item atualizado com sucesso'}
const SUCCESS_DELETE_ITEM   = {status: true, status_code: 204}

module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    SUCCESS_CREATED_ITEM,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_NOT_FOUND,
    SUCCESS_RESPONSE,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETE_ITEM
}