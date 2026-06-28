const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertFilmeAtor = async function (filmeAtor) {
    try {
        let sql = `insert into tbl_filme_ator (
            id_filme,
            id_ator
        ) values (
            ${filmeAtor.id_filme},
            ${filmeAtor.id_ator}
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

const updateFilmeAtor = async function (filmeAtor) {
    try {
        let sql = `update tbl_filme_ator set
                        id_filme    = ${filmeAtor.id_filme}
                        id_ator     = ${filmeAtor.id_ator}
                    where id = ${filmeAtor.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllFilmeAtor = async function () {
    try {
        let sql = 'select * from tbl_filme_ator order by id desc;'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {

    }
}

const selectByIdFilmeAtor = async function (id) {
    try {
        let sql = `select * from tbl_filme_ator where id = ${id};`

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

const selectAtoresByIdFilme = async function (idFilme) {
    try {
        let sql = ` select tbl_ator.*
                    from tbl_filme

                        inner join tbl_filme_ator
                            on tbl_filme.id = tbl_filme_ator.id_filme
                        inner join tbl_ator
                            on tbl_ator.id = tbl_filme_ator.id_ator
                    
                    where tbl_filme.id = ${idFilme};`

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

const selectFilmesByIdAtor = async function (idAtor) {
    try {
        let sql = ` select tbl_filme.*
                    from tbl_filme
                    
                        inner join tbl_filme_ator
                            on tbl_filme.id = tbl_filme_ator.id_filme
                        inner join tbl_ator
                            on tbl_ator.id = tbl_filme_ator.id_ator
                    
                    where tbl_ator.id = ${idAtor};`

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

const deleteFilmeAtor = async function (id) {
    try {
        let sql = `delete from tbl_filme_ator where id = ${id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteAtoresByIdFilme = async function (idFilme) {
    try {
        let sql = `delete from tbl_filme_ator where id_filme = ${idFilme};`

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
    insertFilmeAtor,
    updateFilmeAtor,
    selectAllFilmeAtor,
    selectByIdFilmeAtor,
    selectAtoresByIdFilme,
    selectFilmesByIdAtor,
    deleteFilmeAtor,
    deleteAtoresByIdFilme
}