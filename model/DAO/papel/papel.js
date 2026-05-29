/****************************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados de Papel no banco de dados MySQL
* Data: 29/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertPapel = async function (papel) {
    try {
        let sql = `insert into tbl_papel (
            nome_papel,
            descricao,
            id_ator
            ) values (
                '${papel.sexo}',
                '${papel.sigla}',
                ${papel.id_ator}
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

const updatePapel = async function (papel) {
    try {

        let sql = `update tbl_papel set 
                        nome_papel = '${papel.nome_papel}',
                        descricao  = '${papel.descricao}',
                        id_ator    = ${papel.id_ator}
                    where id = ${papel.id};`

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

const selectAllPapel = async function () {
    try {
        let sql = 'select * from tbl_papel order by id desc;'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

const selectByIdPapel = async function (id) {
    try {
        let sql = `select * from tbl_papel where id = ${id};`

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

const deletePapel = async function (id) {
    try {
        let sql = `delete from tbl_papel where id = ${id};`

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
    insertPapel,
    updatePapel,
    selectAllPapel,
    selectByIdPapel,
    deletePapel
}