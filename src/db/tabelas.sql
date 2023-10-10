create database if not exists api_2023_2;

use api_2023_2;

## tabela usuario(incompletas pois para a entrega da 1ªsprint não é necessário senha ou outras coisas)
create table if not exists usuario(
	user_id int primary key auto_increment,
    user_nome varchar(50),
    user_sobrenome varchar(50),
    user_cpf varchar(15),
    user_email varchar(50),
    user_telefone varchar(15)
    #,user_senha varchar(20)
);

create table if not exists stats(
	sta_id int auto_increment,
    sta_nome varchar(20),
    primary key (sta_id)
);

create table if not exists prioridade(
	pri_id int auto_increment,
    pri_nome varchar(20),
    primary key (pri_id)
);

##tabela cliente, dependente da tabela usuario
create table if not exists cliente(
	cli_id int primary key auto_increment,
    /*cli_cep varchar(9),
    cli_end_num int,
    foreign key (cli_cep) references endereco(end_cep),*/
    user_id int unique, 
		foreign key (user_id) references usuario(user_id)
);

/* tabela chamada, incompleta pois para a 1ª só é necessário um lugar para salvar o que for escrito */
create table if not exists chamada(
	cha_id int primary key auto_increment,
    cha_tema varchar(30),
    cha_desc varchar(255),
    cha_inicio datetime,
    cha_final datetime,
    cli_id int not null,
    sta_id int not null,
    pri_id int not null,
    
    foreign key (sta_id) references stats(sta_id),
    foreign key (pri_id) references prioridade(pri_id),
	foreign key (cli_id) references cliente(cli_id) ON DELETE CASCADE ON UPDATE CASCADE
);




## Estas tabelas estão comentadas, pois serão desnecessárias para a 1ª sprint já que não terá nenhum sistema de login ou resposta das chamadas

##Tabela endereço
create table if not exists endereco(
	end_cep varchar(9) primary key,
    end_bairro varchar(30),
    end_rua varchar(30),
    end_cidade varchar(80),
    end_estado varchar(2)
);

##tabela funcionario, dependente da tabela usuario
create table if not exists atendente(
	ate_id int primary key auto_increment,
	ate_turno varchar(15),
    user_id int unique, 
		foreign key (user_id) references usuario(user_id)
);

##table adm, dependente da tabela usuario
create table if not exists administrador(
	adm_id int auto_increment,
	user_id int unique, 
    primary key (adm_id),
	foreign key (user_id) references usuario(user_id)
);

## relacionamento de muitos para muitos, ou seja vários funcionários podem atender à diferentes ou a mesma chamada
create table if not exists atendente_chamada(
	ate_id int,
		foreign key (ate_id) references atendente(ate_id),
	cha_id int,
		foreign key(cha_id) references chamada(cha_id)
);


create table if not exists resposta(
	res_id int primary key,
    res_desc varchar(255),
	cli_id int,
		foreign key (cli_id) references cliente(cli_id),
	ate_id int,
		foreign key (ate_id) references atendente(ate_id),
	cha_id int,
		foreign key (cha_id) references chamada(cha_id)
);

