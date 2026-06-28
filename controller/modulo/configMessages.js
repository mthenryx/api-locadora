const DEFAULT_MESSAGE = {
    api_description: 'API para controlar o projeto de Filmes',
    development: 'Matheus Henry dos Santos',
    version: '1.0.4.26',
    status: Boolean,
    status_code: Number,
    response: {}
}

//Mensagens de ERRO do projeto de filmes
const ERROR_BAD_REQUEST = {
    status: false,
    status_code: 400,
    message: 'Não foi possível processar a requisição devido a erros de entrada de dados.'
}

const ERROR_INTERNAL_SERVER_MODEL = {
    status: false,
    status_code: 500,
    message: 'Não foi possível processar a requisição devido a um erro interno no servidor [MODEL]'
}

const ERROR_CONTENT_TYPE = {
    status: false,
    status_code: 415,
    message: 'Não foi possível processar a requisição, pois o formato de dados encaminhado não é suportado pelo servidor, apenas deve ser utilizado JSON.'
}

const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: false,
    status_code: 500,
    message: 'Não foi possível processar a requisição devido a um erro interno no servidor [CONTROLLER]'
}

const ERROR_NOT_FOUND = {
    status: false,
    status_code: 404,
    message: 'Não foram encontrados dados para retorno'
}

//Mensagens de SUCESSO do projeto de filmes
const SUCCESS_CREATED_ITEM = {
    status: true,
    status_code: 201,
    message: 'Item inserido com sucesso!'
}

const SUCCESS_RESPONSE = {
    status: true,
    status_code: 200
}

const SUCCESS_UPDATE_ITEM = {
    status: true,
    status_code: 200,
    message: 'Item atualizado com sucesso!'
}

const SUCCESS_DELETE_ITEM = {
    status: true,
    status_code: 204
}

const SUCCESS_CREATED_ITEM_WARNING = {
    status: true,
    status_code: 201,
    message: 'Item inserido com sucesso, porém alguns dados tiveram problemas no cadastro [DADOS DE RELACIONAMENTO]'
}

module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    SUCCESS_CREATED_ITEM,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_NOT_FOUND,
    SUCCESS_RESPONSE,
    SUCCESS_UPDATE_ITEM,
    SUCCESS_DELETE_ITEM,
    SUCCESS_CREATED_ITEM_WARNING
}