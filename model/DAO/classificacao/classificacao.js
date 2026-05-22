/****************************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados de Classificacao no banco de dados 
* MySQL
* Data: 08/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/
//Import da biblioteca para manipular dados no Banco de dados MySQL
const knex = require('knex')

//Import do arquivo de configurações para acesso ao banco
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

//Criar a conexão com o banco de dados MySQL conforme o arquivo de configuração
const knexConection = knex(knexDataBaseConfig.development)

const insertClassificacao = async function (classificacao) {
    try {
        let sql = `insert into tbl_classificacao (
            classificacao
            ) values (
                '${classificacao.classificacao}'
            );`

        let result = await knexConection.raw(sql)

        if (result) {
            return result[0].insertId
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateClassificacao = async function (classificacao) {
    try {

        let sql = `update tbl_classificacao set 
                        classificacao = '${classificacao.classificacao}'
                    where id = ${classificacao.id};`

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

const selectAllClassificacao = async function () {
    try {
        let sql = 'select * from tbl_classificacao order by id desc;'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

const selectByIdClassificacao = async function (id) {
    try {
        let sql = `select * from tbl_classificacao where id = ${id};`

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

const deleteClassificacao = async function (id) {
    try {
        let sql = `delete from tbl_classificacao where id = ${id};`

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
    insertClassificacao,
    updateClassificacao,
    selectAllClassificacao,
    selectByIdClassificacao,
    deleteClassificacao
}