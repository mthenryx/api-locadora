const knex = require('knex')
const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertDiretor = async function (diretor) {
    try {
        let sql = `insert into tbl_diretor (
            nome,
            data_nascimento,
            biografia,
            id_sexo_diretor,
            id_nacionalidade_diretor
        ) values (
            '${diretor.nome}',
            '${diretor.data_nascimento}',
            if('${diretor.biografia}' = '', null, '${diretor.biografia}'),
            ${diretor.id_sexo_diretor},
            ${diretor.id_nacionalidade_diretor}
        );`

        //Encaminha para o banco de dados o scriptSQL
        let result = await knexConection.raw(sql)

        if (result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        return false
    }

}

const updateDiretor = async function (diretor) {
    try {
        let sql = `update tbl_diretor set
	                    nome                        = replace("${diretor.nome}", "'", ""),
                        data_nascimento             = replace("${diretor.data_nascimento}", "'", ""),
                        biografia                   = if('${diretor.biografia}' = '', null, replace("${diretor.biografia}", "'", "")),
                        id_sexo_diretor             = ${diretor.id_sexo_diretor},
                        id_nacionalidade_diretor    = ${diretor.id_nacionalidade_diretor}
                    where id = ${diretor.id};`
        
        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllDiretor = async function () {
    try {
        let sql = 'select * from tbl_diretor order by id desc'

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0] //Retorna somente o indice com a lista
        else
            return false

    } catch (error) {

    }
}

const selectByIdDiretor = async function (id) {
    try {
        let sql = `select * from tbl_diretor where id = ${id}`

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

        if (result)
            return true
        else
            return false
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