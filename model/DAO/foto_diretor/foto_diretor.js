const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertFotoDiretor = async function (fotoDiretor) {
    try {
        let sql = `insert into tbl_foto_diretor (
            id_foto,
            id_diretor
        ) values (
            ${fotoDiretor.id_foto},
            ${fotoDiretor.id_diretor} 
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

const updateFotoDiretor = async function (fotoDiretor) {
    try {
        let sql = `update tbl_foto_diretor set
                        id_foto = ${fotoDiretor.id_foto}
                        id_diretor = ${fotoDiretor.id_diretor}
                    where id = ${fotoDiretor.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllFotoDiretor = async function () {
    try {
        let sql = `select * from tbl_foto_diretor order by id desc;`

        let result = await knexConection.raw(sql)

        if (result.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdFotoDiretor = async function (id) {
    try {
        let sql = `select * from tbl_foto_diretor where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectFotosByIdDiretor = async function (idDiretor) {
    try {
        let sql = `select tbl_foto.*
                    from tbl_diretor
                        
                        inner join tbl_foto_diretor
                            on tbl_diretor.id = tbl_foto_diretor.id_diretor
                        inner join tbl_foto
                            on tbl_foto.id = tbl_foto_diretor.id_foto
                            
                    where tbl_diretor.id = ${idDiretor};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectDiretoresByIdFoto = async function (idFoto) {
    try {
        let sql = `select tbl_diretor.*
                    from tbl_diretor

                        inner join tbl_foto_diretor
                            on tbl_diretor.id = tbl_foto_diretor.id_diretor
                        inner join tbl_foto
                            on tbl_foto.id = tbl_foto_diretor.id_foto
                    
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

const deleteFotoDiretor = async function (id) {
    try {
        let sql = `delete from tbl_foto_diretor where id = ${id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteFotosByIdDiretor = async function (idDiretor) {
    try {
        let sql = `delete from tbl_foto_diretor where id_diretor = ${idDiretor}`

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
    insertFotoDiretor,
    updateFotoDiretor,
    selectAllFotoDiretor,
    selectByIdFotoDiretor,
    selectFotosByIdDiretor,
    selectDiretoresByIdFoto,
    deleteFotoDiretor,
    deleteFotosByIdDiretor
}