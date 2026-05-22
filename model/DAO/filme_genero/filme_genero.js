/****************************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados da tabela filme_genero no banco de dados 
* MySQL
* Data: 22/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertFilmeGenero = async function (filmeGenero) {
    try {
        let sql = `insert into tbl_filme_genero (
            id_filme,
            id_genero 
        ) values (
            ${filmeGenero.id_filme},
            ${filmeGenero.id_genero}
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

const updateFilmeGenero = async function (filmeGenero) {
    try {
        let sql = `update tbl_filme_genero set 
                        id_filme  = ${filmeGenero.id_filme}
                        id_genero = '${filmeGenero.id_genero}'
                    where id = ${filmeGenero.id};`

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

const selectAllFilmeGenero = async function () {
    try {
        let sql = 'select * from tbl_filme_genero order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

const selectByIdFilmeGenero = async function (id) {
    try {
        let sql = `select * from tbl_filme_genero where id = ${id};`

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

//Função para retornar os dados do genero filtrando pelo id do filme
const selectByIdFilme = async function (idFilme) {
    try {
        let sql = ` select tbl_genero.*
                    from tbl_filme
                        inner join tbl_filme_genero
                            on tbl_filme.id = tbl_filme_genero.id_filme
                        inner join tbl_genero
                            on tbl_genero.id = tbl_filme_genero.id_genero 
                    where id = ${id};`

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

const deleteFilmeGenero = async function (id) {
    try {
        let sql = `delete from tbl_filme_genero where id = ${id};`

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
    insertFilmeGenero,
    updateFilmeGenero,
    selectAllFilmeGenero,
    selectByIdFilmeGenero,
    deleteFilmeGenero
}