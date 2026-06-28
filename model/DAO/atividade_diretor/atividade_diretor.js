const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertAtividadeDiretor = async function (atividadeDiretor) {
    try {
        let sql = `insert into tbl_atividade_diretor (
            id_atividade,
            id_diretor
        ) values (
            ${atividadeDiretor.id_atividade},
            ${atividadeDiretor.id_diretor} 
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

const updateAtividadeDiretor = async function (atividadeDiretor) {
    try {
        let sql = `update tbl_atividade_diretor set
                        id_atividade = ${atividadeDiretor.id_atividade}
                        id_diretor = ${atividadeDiretor.id_diretor}
                    where id = ${atividadeDiretor.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllAtividadeDiretor = async function () {
    try {
        let sql = `select * from tbl_atividade_diretor order by id desc;`

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

const selectByIdAtividadeDiretor = async function (id) {
    try {
        let sql = `select * from tbl_atividade_diretor where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAtividadesByIdDiretor = async function (idDiretor) {
    try {
        let sql = `select tbl_atividade.*
                    from tbl_diretor
                        
                        inner join tbl_atividade_diretor
                            on tbl_diretor.id = tbl_atividade_diretor.id_diretor
                        inner join tbl_atividade
                            on tbl_atividade.id = tbl_atividade_diretor.id_atividade
                            
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

const selectDiretoresByIdAtividade = async function (idAtividade) {
    try {
        let sql = `select tbl_diretor.*
                    from tbl_diretor

                        inner join tbl_atividade_diretor
                            on tbl_diretor.id = tbl_atividade_diretor.id_diretor
                        inner join tbl_atividade
                            on tbl_atividade.id = tbl_atividade_diretor.id_atividade
                    
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

const deleteAtividadeDiretor = async function (id) {
    try {
        let sql = `delete from tbl_atividade_diretor where id = ${id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteAtividadesByIdDiretor = async function (idDiretor) {
    try {
        let sql = `delete from tbl_atividade_diretor where id_diretor = ${idDiretor}`

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
    insertAtividadeDiretor,
    updateAtividadeDiretor,
    selectAllAtividadeDiretor,
    selectByIdAtividadeDiretor,
    selectAtividadesByIdDiretor,
    selectDiretoresByIdAtividade,
    deleteAtividadeDiretor,
    deleteAtividadesByIdDiretor
}