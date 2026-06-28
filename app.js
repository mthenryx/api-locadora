//Import das dependencias para criar a API
const express = require('express')
const cors = require('cors')

//Criando um objeto do express para criar a API
const app = express()

//Configurações do CORS da API
const corsOptions = {
    origin: ['*'], //Configuração de origem da requisição (IP ou Dominio)
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //Configuração dos verbos que serão utilizados na API
    allowedHeaders: ['Content-type', 'Authorization'] //Configurações de permissões
    //Tipo de dados  //Autorização de acesso
}

//Aplica as configurações do CORS no app (EXPRESS)
app.use(cors(corsOptions))

const filmeRouter = require('./routes/filme.router.js')
app.use('/v1/senai/locadora/filme', cors(), filmeRouter)

const classificacaoRouter = require('./routes/classificacao.router.js')
app.use('/v1/senai/locadora/classificacao', cors(), classificacaoRouter)

const sexoRouter = require('./routes/sexo.router.js')
app.use('/v1/senai/locadora/sexo', cors(), sexoRouter)

const nacionalidadeRouter = require('./routes/nacionalidade.router.js')
app.use('/v1/senai/locadora/nacionalidade', cors(), nacionalidadeRouter)

//Import do arquivo de rotas do GENERO
const generoRouter = require('./routes/genero.router.js')
app.use('/v1/senai/locadora/genero', cors(), generoRouter)

const atividadeRouter = require('./routes/atividade.router.js')
app.use('/v1/senai/locadora/atividade', cors(), atividadeRouter)

const fotoRouter = require('./routes/foto.router.js')
app.use('/v1/senai/locadora/foto', cors(), fotoRouter)

const diretorRouter = require('./routes/diretor.router.js')
app.use('/v1/senai/locadora/diretor', cors(), diretorRouter)

const atorRouter = require('./routes/ator.router.js')
app.use('/v1/senai/locadora/ator', cors(), atorRouter)

app.listen(8080, function () {
    console.log('API aguardando novas requisições...')
})