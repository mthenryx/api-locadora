const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertNacionalidade = async function (nacionalidade) {
    try {
        let sql = `insert into tbl_nacionalidade (
            nacionalidade,
            sigla
        ) values (
            '${nacionalidade.nacionalidade}',
            '${nacionalidade.sigla}'
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

const updateNacionalidade = async function (nacionalidade) {
    try {
        let sql = `update tbl_nacionalidade set
                        nacionalidade    = '${nacionalidade.nacionalidade}',
                        sigla            = '${nacionalidade.sigla}'
                    where id = ${nacionalidade.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllNacionalidade = async function () {
    try {
        let sql = 'select * from tbl_nacionalidade order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

    }
}

const selectByIdNacionalidade = async function (id) {
    try {
        let sql = `select * from tbl_nacionalidade where id = ${id}`

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

const deleteNacionalidade = async function (id) {
    try {
        let sql = `delete from tbl_nacionalidade where id = ${id};`

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
    insertNacionalidade,
    updateNacionalidade,
    selectAllNacionalidade,
    selectByIdNacionalidade,
    deleteNacionalidade
}