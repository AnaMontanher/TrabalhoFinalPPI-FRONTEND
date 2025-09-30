create database clienteLivro;

use clienteLivro;


create table if not exists cliente(
cli_cpf  varchar (14) null primary key,
cli_nome varchar(200) not null,
cli_telefone varchar(20) not null,
cli_dataNasc DATE not null,
cli_sexo CHAR(1),
cli_email VARCHAR(100) NOT NULL,
cli_senha VARCHAR(20) NOT NULL
);

create table if not exists livro(
liv_id int not null primary key auto_increment,
liv_titulo varchar(200) not null,
liv_autor varchar(50) not null,
cli_cpf VARCHAR(14) NOT NULL,
constraint fk_livro foreign key (cli_cpf) references cliente(cli_cpf)
);