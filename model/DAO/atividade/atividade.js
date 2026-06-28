const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertAtividade = async function (atividade) {
    try {
        let sql = `insert into tbl_atividade (
            atividade
        ) values (
            '${atividade.atividade}'
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

const updateAtividade = async function (atividade) {
    try {
        let sql = `update tbl_atividade set
                        atividade = '${atividade.atividade}'
                    where id = ${atividade.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllAtividade = async function () {
    try {
        let sql = 'select * from tbl_atividade order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

    }
}

const selectByIdAtividade = async function (id) {
    try {
        let sql = `select * from tbl_atividade where id = ${id}`

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

const deleteAtividade = async function (id) {
    try {
        let sql = `delete from tbl_atividade where id = ${id};`

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
    insertAtividade,
    updateAtividade,
    selectAllAtividade,
    selectByIdAtividade,
    deleteAtividade
}