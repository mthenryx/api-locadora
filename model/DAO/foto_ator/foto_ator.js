const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertFotoAtor = async function (fotoAtor) {
    try {
        let sql = `insert into tbl_foto_ator (
            id_foto,
            id_ator
        ) values (
            ${fotoAtor.id_foto},
            ${fotoAtor.id_ator} 
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

const updateFotoAtor = async function (fotoAtor) {
    try {
        let sql = `update tbl_foto_ator set
                        id_foto = ${fotoAtor.id_foto}
                        id_ator = ${fotoAtor.id_ator}
                    where id = ${fotoAtor.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllFotoAtor = async function () {
    try {
        let sql = `select * from tbl_foto_ator order by id desc;`

        let result = await knexConection.raw(sql)

        if (result.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdFotoAtor = async function (id) {
    try {
        let sql = `select * from tbl_foto_ator where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectFotosByIdAtor = async function (idAtor) {
    try {
        let sql = `select tbl_foto.*
                    from tbl_ator
                        
                        inner join tbl_foto_ator
                            on tbl_ator.id = tbl_foto_ator.id_ator
                        inner join tbl_foto
                            on tbl_foto.id = tbl_foto_ator.id_foto
                            
                    where tbl_ator.id = ${idAtor};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAtoresByIdFoto = async function (idFoto) {
    try {
        let sql = `select tbl_ator.*
                    from tbl_ator

                        inner join tbl_foto_ator
                            on tbl_ator.id = tbl_foto_ator.id_ator
                        inner join tbl_foto
                            on tbl_foto.id = tbl_foto_ator.id_foto
                    
                    where tbl_foto.id = ${idFoto};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteFotoAtor = async function (id) {
    try {
        let sql = `delete from tbl_foto_ator where id = ${id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteFotosByIdAtor = async function (idAtor) {
    try {
        let sql = `delete from tbl_foto_ator where id_ator = ${idAtor}`

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
    insertFotoAtor,
    updateFotoAtor,
    selectAllFotoAtor,
    selectByIdFotoAtor,
    selectFotosByIdAtor,
    selectAtoresByIdFoto,
    deleteFotoAtor,
    deleteFotosByIdAtor
}