#Permite criar um database
create database db_filmes_20261_b;

#Permite visualizar todos os databases existentes
show databases;

#Permite escolher o database a ser utilizado;
use db_filmes_20261_b;

#Permite visualizar todas as tabelas existentes dentro do database
show tables;

#Cria uma table no banco de dados 
create table tbl_filme (
	id 					int not null auto_increment primary key,
    nome 				varchar(80) not null, 
    sinopse 			text not null,
    capa 				varchar(255) not null,
    data_lancamento 	date not null,
    duracao 			time not null,
    valor 				decimal(5,2) default 0,
    avaliacao 			decimal(3,2) default null
);

#Apaga a table do banco de dados
#drop table tbl_filme;

#Apaga um database
#drop database db_filmes_20261_b;

insert into tbl_filme (
    nome, 
    sinopse,
    capa,
    data_lancamento,
    duracao,
    valor,
    avaliacao
) values (
	'Super Mario Galaxy: O Filme',
    'O bigodudo encanador italiano e seus aliados embarcam numa aventura galáctica 
    repleta de ação e momentos emocionantes depois de salvar o Reino dos Cogumelos.',
    'https://br.web.img3.acsta.net/c_310_420/img/5b/ea/5bea1aeac3323aeaaf82449a34fafbbf.jpg',
    '2026-04-02',
    '01:39:00',
    '50.60',
    '3'
);

select * from tbl_filme_genero order by id desc;

select * from tbl_filme where id = 24;

update tbl_filme set 
	nome = '',
    sinopse = '',
    capa = '',
    data_lancamento = '',
    duracao = '',
    valor = '',
    avaliacao = ''
where id = 65;

delete from tbl_filme where id > 0;

create table tbl_classificacao (
	id 			   int not null auto_increment primary key,
    classificacao  varchar(6) not null
);

create table tbl_sexo (
	id 		int not null auto_increment primary key,
    sexo	varchar(20) not null,
    sigla	varchar(24) not null
);

create table tbl_nacionalidade (
	id 				int not null auto_increment primary key,
    nacionalidade   varchar(90) not null,
    sigla 			varchar(4) not null
);

create table tbl_genero (
	id 		int not null auto_increment primary key,
    genero	varchar(20) not null
);

create table tbl_filme_genero (
	id 			int not null auto_increment primary key,
    id_filme 	int not null,
    id_genero 	int not null,
    
    constraint FK_FILME_FILME_GENERO
    foreign key (id_filme)
    references tbl_filme(id),
    
    constraint FK_GENERO_FILME_GENERO
    foreign key (id_genero)
    references tbl_genero(id)
);

create table tbl_fotos (
	id 		 int not null auto_increment primary key,
    foto_url varchar(255) not null
);

create table tbl_diretor (
	id 		    	  int not null auto_increment primary key,
    nome     		  varchar(100) not null,
    biografia   	  text,
    data_nascimento   date not null,
    id_nacionalidade  int not null,
    id_sexo 		  int not null,
    
	constraint FK_NACIONALIDADE_DIRETOR
	foreign key (id_nacionalidade)
	references tbl_nacionalidade(id),
        
	constraint FK_SEXO_DIRETOR
	foreign key (id_sexo)
	references tbl_sexo(id)
);

select * from tbl_ator;

create table tbl_ator (
	id 		    	  int not null auto_increment primary key,
    nome     		  varchar(100) not null,
    biografia   	  text,
    data_nascimento   date not null,
    id_nacionalidade  int not null,
    id_sexo 		  int not null,
    
	constraint FK_NACIONALIDADE_ATOR
	foreign key (id_nacionalidade)
	references tbl_nacionalidade(id),
        
	constraint FK_SEXO_ATOR
	foreign key (id_sexo)
	references tbl_sexo(id)
);

select * from tbl_papel;

create table tbl_papel (
	id 		    	  int not null auto_increment primary key,
    nome_papel     	  varchar(70) not null,
    descricao   	  text,
    id_ator 		  int not null,
    
	constraint FK_ATOR_PAPEL
	foreign key (id_ator)
	references tbl_ator(id)
);

delete from tbl_filme;

alter table tbl_ator
	add	constraint FK_NACIONALIDADE_DIRETOR
	foreign key (id_nacionalidade)
	references tbl_nacionalidade(id),
        
	add constraint FK_SEXO_DIRETOR
	foreign key (id_sexo)
	references tbl_sexo(id);
        
desc tbl_filme;
        
update tbl_classificacao set 
	classificacao = 'teste'
where id = 2;

desc tbl_classificacao;

select * from tbl_filme order by id desc;


    
