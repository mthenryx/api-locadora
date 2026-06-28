const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertFoto = async function (foto) {
    try {
        let sql = `insert into tbl_foto (
            foto_url
        ) values (
            '${foto.foto_url}'
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

const updateFoto = async function (foto) {
    try {
        let sql = `update tbl_foto set
                        foto_url = '${foto.foto_url}'
                    where id = ${foto.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllFoto = async function () {
    try {
        let sql = 'select * from tbl_foto order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

    }
}

const selectByIdFoto = async function (id) {
    try {
        let sql = `select * from tbl_foto where id = ${id}`

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

const deleteFoto = async function (id) {
    try {
        let sql = `delete from tbl_foto where id = ${id};`

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
    insertFoto,
    updateFoto,
    selectAllFoto,
    selectByIdFoto,
    deleteFoto
}