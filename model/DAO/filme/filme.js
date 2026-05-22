/****************************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados do Filme no banco de dados 
* MySQL
* Data: 15/04/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/
//Import da biblioteca para manipular dados no Banco de dados MySQL
const knex = require('knex')

//Import do arquivo de configurações para acesso ao banco
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

//Criar a conexão com o banco de dados MySQL conforme o arquivo de configuração
const knexConection = knex(knexDataBaseConfig.development)

//Função para inserir um novo filme no banco de dados
const insertFilme = async function (filme) {
    try {
        let sql = `insert into tbl_filme (
        nome, 
        sinopse,
        capa,
        data_lancamento,
        duracao,
        valor,
        avaliacao,
        id_classificacao
        ) values (
    	    '${filme.nome}',
            '${filme.sinopse}',
            '${filme.capa}',
            '${filme.data_lancamento}',
            '${filme.duracao}',
            '${filme.valor}',
           if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'),
            ${filme.id_classificacao}
        );`

        //Encaminha para o BD o scriptSQL
        let result = await knexConection.raw(sql)

        if (result) {
            return result[0].insertId //Devolve o id do filme inserido
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//Função para atuaizar um filme existente no banco de dados
const updateFilme = async function (filme) {
    try {
        let sql = `update tbl_filme set 
                        nome             = '${filme.nome}',
                        sinopse          = '${filme.sinopse}',
                        capa             = '${filme.capa}',
                        data_lancamento  = '${filme.data_lancamento}',
                        duracao          = '${filme.duracao}',
                        valor            = '${filme.valor}',
                        avaliacao        = if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'),
                        id_classificacao = '${filme.id_classificacao}'
                    where id = ${filme.id};`

        let result = await knexConection.raw(sql)

        if (result) {
            return true
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

//Função para retornar todos os dados de filme do banco de dados
const selectAllFilme = async function () {
    try {
        //Script SQL para listar todos os filmes 
        let sql = 'select * from tbl_filme order by id desc'

        //Executa no BD o filme e guarda o retorno do BD,
        //Pode ser um ERRO (false) Ou um ARRAY com os dados 
        let result = await knexConection.raw(sql)

        //Validação para verificar se o retorno do BD é um 
        //ARRAY ou um BOLLEAN (false)
        if (Array.isArray(result))
            return result[0] //Retorna somente o indice com a lista de filmes
        else
            return false

    } catch (error) {
        return false
    }
}

//Função para retornar um filme filtrando pelo ID
const selectByIdFilme = async function (id) {
    try {
        let sql = `select * from tbl_filme where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

//Função para escluir um filme filtrando pelo ID
const deleteFilme = async function (id) {
    try {
        let sql = `delete from tbl_filme where id = ${id};`

        let result = await knexConection.raw(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    insertFilme,
    updateFilme,
    selectAllFilme,
    selectByIdFilme,
    deleteFilme
}