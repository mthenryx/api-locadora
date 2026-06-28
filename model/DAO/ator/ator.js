const knex = require('knex')

const knexDataBaseConfig = require('../../database/database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertAtor = async function (ator) {
    try {
        let sql = `insert into tbl_ator (
            nome,
            data_nascimento,
            biografia,
            id_sexo_ator,
            id_nacionalidade_ator
        ) values (
            '${ator.nome}',
            '${ator.data_nascimento}',
            if('${ator.biografia}' = '', null, '${ator.biografia}'),
            ${ator.id_sexo_ator},
            ${ator.id_nacionalidade_ator}
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

const updateAtor = async function (ator) {
    try {
        let sql = `update tbl_ator set
	                    nome                        = replace("${ator.nome}", "'", ""),
                        data_nascimento             = replace("${ator.data_nascimento}", "'", ""),
                        biografia                   = if('${ator.biografia}' = '', null, replace("${ator.biografia}", "'", "")),
                        id_sexo_ator             = ${ator.id_sexo_ator},
                        id_nacionalidade_ator    = ${ator.id_nacionalidade_ator}
                    where id = ${ator.id};`
        
        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
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

    }
}

const selectByIdAtor = async function (id) {
    try {
        let sql = `select * from tbl_ator where id = ${id}`

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

        if (result)
            return true
        else
            return false
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