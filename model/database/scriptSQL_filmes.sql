#Permite criar um database
create database db_filmes_20261_b;

#Permite visualizar todos os databases existentes
show databases;

#Permite escolher o database a ser utilizado
use db_filmes_20261_b;

#Permite visualizar todas as tabelas existentes dentro do database
show tables;

#Tabela Classificação
create table tbl_classificacao (
	id 				int not null auto_increment primary key,
    classificacao 	varchar(6) not null
);

#Criar tabela
create table tbl_filme (
	id 					int not null auto_increment primary key,
    nome 				varchar(80) not null,
    sinopse 			text not null,
    capa 				varchar(255) not null,
    data_lancamento 	date not null,
    duracao 			time not null,
    valor 				decimal(5,2) default 0,
    avaliacao 			decimal(3,2) default null,
    id_classificacao	int not null,
    
    #Relação entre Classificação e Filme
    constraint FK_CLASSIFICACAO_FILME
    foreign key (id_classificacao)
    references tbl_classificacao(id)
);

#Tabela Sexo
create table tbl_sexo (
	id 		int not null auto_increment primary key,
    sexo 	varchar(20) not null,
    sigla 	varchar(3) not null
);

#Tabela Nacionalidade
create table tbl_nacionalidade (
	id 				int not null auto_increment primary key,
    nacionalidade 	varchar(90) not null,
    sigla 			varchar(4) not null
);

#Tabela Genero
create table tbl_genero (
	id 		int not null auto_increment primary key,
    genero 	varchar(30) not null
);

#Tabela Intermediaria Filme e Genero
create table tbl_genero_filme (
	id 			int not null auto_increment primary key,
    id_filme 	int not null,
    id_genero 	int not null,
    
    constraint FK_FILME_GENEROFILME
    foreign key (id_filme)
    references tbl_filme(id),
    
    constraint FK_GENERO_GENEROFILME
    foreign key (id_genero)
    references tbl_genero(id)
);

#Tabela Atividade
create table tbl_atividade (
	id 			int not null auto_increment primary key,
    atividade 	varchar(40) not null
);

#Tabela Foto
create table tbl_foto (
	id 			int not null auto_increment primary key,
    foto_url 	varchar(255) not null
);

#Tabela Diretor
create table tbl_diretor (
	id 							int not null auto_increment primary key,
    nome 						varchar(100) not null,
    data_nascimento 			date not null,
    biografia 					text,
    id_sexo_diretor 			int not null,
    id_nacionalidade_diretor 	int not null,
    
    #Relação entre a Tabela de Sexo e Diretor
    constraint FK_SEXO_DIRETOR
    foreign key (id_sexo_diretor)
    references tbl_sexo(id),
    
    #Relação entre a Tabela Nacionalidade e Diretor
    constraint FK_NACIONALIDADE_DIRETOR
    foreign key (id_nacionalidade_diretor)
    references tbl_nacionalidade(id)
);

#Tabela Ator
create table tbl_ator (
	id 							int not null auto_increment primary key,
    nome 						varchar(100) not null,
    data_nascimento 			date not null,
    biografia 					text,
    id_sexo_ator 				int not null,
    id_nacionalidade_ator 		int not null,
    
    #Relação entre a Tabela de Sexo e Ator
    constraint FK_SEXO_ATOR
    foreign key (id_sexo_ator)
    references tbl_sexo(id),
    
    #Relação entre a Tabela Nacionalidade e Ator
    constraint FK_NACIONALIDADE_ATOR
    foreign key (id_nacionalidade_ator)
    references tbl_nacionalidade(id)
);

#Tabela Foto Ator
create table tbl_foto_ator (
	id 		int not null auto_increment primary key,
    id_foto int not null,
    id_ator int not null,
    
    #Relação entre Foto e FotoAtor
    constraint FK_FOTO_FOTOATOR
    foreign key (id_foto)
    references tbl_foto(id),
    
    #Relação entre Ator e FotoAtor
    constraint FK_ATOR_FOTOATOR
    foreign key (id_ator)
    references tbl_ator(id)
);

#Tabela Foto Diretor
create table tbl_foto_diretor (
	id 			int not null auto_increment primary key,
    id_foto 	int not null,
    id_diretor 	int not null,
    
    #Relação entre Foto e FotoDiretor
    constraint FK_FOTO_FOTODIRETOR
    foreign key (id_foto)
    references tbl_foto(id),
    
    #Relação entre Diretor e FotoDiretor
    constraint FK_DIRETOR_FOTODIRETOR
    foreign key (id_diretor)
    references tbl_diretor(id)
);

#Tabela Atividade Ator
create table tbl_atividade_ator (
	id 				int not null auto_increment primary key,
    id_atividade 	int not null,
    id_ator 		int not null,
    
    #Relação entre Atividade e intermediária
    constraint FK_ATIVIDADE_ATIVIDADEATOR
    foreign key (id_atividade)
    references tbl_atividade(id),
    
    #Relação entre Ator e intermediária
    constraint FK_ATOR_ATIVIDADEATOR
    foreign key (id_ator)
    references tbl_ator(id)
);

#Tabela Atividade Diretor
create table tbl_atividade_diretor (
	id 				int not null auto_increment primary key,
    id_atividade 	int not null,
    id_diretor 		int not null,
    
    #Relação entre Atividade e intermediária
    constraint FK_ATIVIDADE_ATIVIDADEDIRETOR
    foreign key (id_atividade)
    references tbl_atividade(id),
    
    #Relação entre Diretor e intermediária
    constraint FK_DIRETOR_ATIVIDADEDIRETOR
    foreign key (id_diretor)
    references tbl_diretor(id)
);

#Tabela Filme Ator
create table tbl_filme_ator (
	id 			int not null auto_increment primary key,
    id_filme 	int not null,
    id_ator 	int not null,
    
    #Relação entre Filme e intermediária
    constraint FK_FILME_FILMEATOR
    foreign key (id_filme)
    references tbl_filme(id),
    
    #Releção entre Ator e intermediária
    constraint FK_ATOR_FILMEATOR
    foreign key (id_ator)
    references tbl_ator(id)
);

#Tabela Filme Diretor
create table tbl_filme_diretor (
	id 			int not null auto_increment primary key,
    id_filme 	int not null,
    id_diretor 	int not null,
    
    #Relação entre Filme e intermediária
    constraint FK_FILME_FILMEDIRETOR
    foreign key (id_filme)
    references tbl_filme(id),
    
    #Releção entre Diretor e intermediária
    constraint FK_DIRETOR_FILMEDIRETOR
    foreign key (id_diretor)
    references tbl_diretor(id)
);

