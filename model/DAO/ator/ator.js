/****************************************************************************************************** 
* Objetivo: Arquivo responsável pelo CRUD de dados das ator no banco de dados 
* MySQL
* Data: 29/05/2026
* Autor: Matheus
* Versão: 1.0
*******************************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertAtor = async function (ator) {
    try {
        let sql = `insert into tbl_ator (
            nome,
            biografia,
            data_nascimento,
            id_nacionalidade,
            id_sexo 
        ) values (
            '${ator.nome}',
            if('${ator.biografia}' = '', null, '${ator.biografia}'),
            '${ator.data_nascimento}',
            ${ator.id_nacionalidade},
            ${ator.id_sexo}
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

const updateAtor = async function (ator) {
    try {
        let sql = `update tbl_ator set 
                            nome             =  '${ator.nome}',
                            biografia        =  if('${ator.biografia}' = '', null, '${ator.biografia}'),
                            data_nascimento  =  '${ator.data_nascimento}',
                            id_nacionalidade =  ${ator.id_nacionalidade},
                            id_sexo          =  ${ator.id_sexo}
                    where id = ${ator.id};`

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

const selectAllAtor = async function () {
    try {
        let sql = 'select * from tbl_ator order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

const selectByIdAtor = async function (id) {
    try {
        let sql = `select * from tbl_ator where id = ${id};`

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

const deleteAtor = async function (id) {
    try {
        let sql = `delete from tbl_ator where id = ${id};`

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
    insertAtor,
    updateAtor,
    selectAllAtor,
    selectByIdAtor,
    deleteAtor
}