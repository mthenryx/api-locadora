/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do GENERO no banco de dados
 *          MySQL
 * Data: 13/05/2026
 * Autor: Matheus Henry dos Santos
 * Versão: 1.0
**************************************************************************************/

//Import da biblioteca para manipular dados no Banco de Dados MySQL
const knex = require('knex')

//Import do arquivo de configuração para acesso ao banco de dados
const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

//Criar a conexão com o banco de dados MySQL conforme o arquivo de configuração
const knexConection = knex(knexDataBaseConfig.development)

const insertGenero = async function (genero) {
    try {
        let sql = `insert into tbl_genero (
            genero
        ) values (
            '${genero.genero}'
        );`

        let result = await knexConection.raw(sql)

        if (result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        return false
    }
}

const updateGenero = async function (genero) {
    try {
        let sql = `update tbl_genero set
                        genero    = '${genero.genero}'
                    where id = ${genero.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllGenero = async function () {
    try {
        let sql = 'select * from tbl_genero order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

    }
}

const selectByIdGenero = async function (id) {
    try {
        let sql = `select * from tbl_genero where id = ${id}`

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

const deleteGenero = async function (id) {
    try {
        let sql = `delete from tbl_genero where id = ${id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertGenero,
    updateGenero,
    selectAllGenero,
    selectByIdGenero,
    deleteGenero
}