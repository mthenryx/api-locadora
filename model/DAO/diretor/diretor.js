/****************************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados das fotos no banco de dados 
* MySQL
* Data: 20/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertDiretor = async function (diretor) {
    try {
        let sql = `insert into tbl_diretor (
            nome,
            biografia,
            data_nascimento,
            id_nacionalidade,
            id_sexo 
        ) values (
            '${diretor.nome}',
            if('${diretor.biografia}' = '', null, '${diretor.biografia}'),
            '${diretor.data_nascimento}',
            ${diretor.id_nacionalidade},
            ${diretor.id_sexo}
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

const updateDiretor = async function (diretor) {
    try {
        let sql = `update tbl_diretor set 
                            nome             =  '${diretor.nome}',
                            biografia        =  if('${diretor.biografia}' = '', null, '${diretor.biografia}'),
                            data_nascimento  =  '${diretor.data_nascimento}',
                            id_nacionalidade =  ${diretor.id_nacionalidade},
                            id_sexo          =  ${diretor.id_sexo}
                    where id = ${diretor.id};`

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

const selectAllDiretor = async function () {
    try {
        let sql = 'select * from tbl_diretor order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

const selectByIdDiretor = async function (id) {
    try {
        let sql = `select * from tbl_diretor where id = ${id};`

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

const deleteDiretor = async function (id) {
    try {
        let sql = `delete from tbl_diretor where id = ${id};`

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
    insertDiretor,
    updateDiretor,
    selectAllDiretor,
    selectByIdDiretor,
    deleteDiretor
}