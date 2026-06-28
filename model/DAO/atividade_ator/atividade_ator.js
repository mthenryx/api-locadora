const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertAtividadeAtor = async function (atividadeAtor) {
    try {
        let sql = `insert into tbl_atividade_ator (
            id_atividade,
            id_ator
        ) values (
            ${atividadeAtor.id_atividade},
            ${atividadeAtor.id_ator} 
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

const updateAtividadeAtor = async function (atividadeAtor) {
    try {
        let sql = `update tbl_atividade_ator set
                        id_atividade = ${atividadeAtor.id_atividade}
                        id_ator = ${atividadeAtor.id_ator}
                    where id = ${atividadeAtor.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllAtividadeAtor = async function () {
    try {
        let sql = `select * from tbl_atividade_ator order by id desc;`

        let result = await knexConection.raw(sql)

        //IF para verificar se o retorno do banco de dados é um array de dados
        if (result.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdAtividadeAtor = async function (id) {
    try {
        let sql = `select * from tbl_atividade_ator where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAtividadesByIdAtor = async function (idAtor) {
    try {
        let sql = `select tbl_atividade.*
                    from tbl_ator
                        
                        inner join tbl_atividade_ator
                            on tbl_ator.id = tbl_atividade_ator.id_ator
                        inner join tbl_atividade
                            on tbl_atividade.id = tbl_atividade_ator.id_atividade
                            
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

const selectAtoresByIdAtividade = async function (idAtividade) {
    try {
        let sql = `select tbl_ator.*
                    from tbl_ator

                        inner join tbl_atividade_ator
                            on tbl_ator.id = tbl_atividade_ator.id_ator
                        inner join tbl_atividade
                            on tbl_atividade.id = tbl_atividade_ator.id_atividade
                    
                    where tbl_atividade.id = ${idAtividade};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteAtividadeAtor = async function (id) {
    try {
        let sql = `delete from tbl_atividade_ator where id = ${id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteAtividadesByIdAtor = async function (idAtor) {
    try {
        let sql = `delete from tbl_atividade_ator where id_ator = ${idAtor}`

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
    insertAtividadeAtor,
    updateAtividadeAtor,
    selectAllAtividadeAtor,
    selectByIdAtividadeAtor,
    selectAtividadesByIdAtor,
    selectAtoresByIdAtividade,
    deleteAtividadeAtor,
    deleteAtividadesByIdAtor
}