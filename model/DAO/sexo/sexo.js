const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertSexo = async function (sexo) {
    try {
        let sql = `insert into tbl_sexo (
            sexo,
            sigla
        ) values (
            '${sexo.sexo}',
            '${sexo.sigla}'
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

const updateSexo = async function (sexo) {
    try {
        let sql = `update tbl_sexo set
                        sexo    = '${sexo.sexo}',
                        sigla   = '${sexo.sigla}'
                    where id = ${sexo.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllSexo = async function () {
    try {
        let sql = 'select * from tbl_sexo order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

    }
}

const selectByIdSexo = async function (id) {
    try {
        let sql = `select * from tbl_sexo where id = ${id}`

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

const deleteSexo = async function (id) {
    try {
        let sql = `delete from tbl_sexo where id = ${id};`

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
    insertSexo,
    updateSexo,
    selectAllSexo,
    selectByIdSexo,
    deleteSexo
}