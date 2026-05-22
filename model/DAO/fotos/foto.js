/****************************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados das fotos no banco de dados 
* MySQL
* Data: 15/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertFoto = async function (foto) {

    try {
        let sql = `insert into tbl_fotos (
            foto_url 
        ) values (
            '${foto.url}'
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

const updateFoto = async function (foto) {
    try {
        let sql = `update tbl_fotos set 
                        foto_url = '${foto.url}'
                    where id = ${foto.id};`

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

const selectAllFoto = async function () {
    try {
        let sql = 'select * from tbl_fotos order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

const selectByIdFoto = async function (id) {
    try {
        let sql = `select * from tbl_fotos where id = ${id};`

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
        let sql = `delete from tbl_fotos where id = ${id};`

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
    insertFoto,
    updateFoto,
    selectAllFoto,
    selectByIdFoto,
    deleteFoto
}