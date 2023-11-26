create database if not exists api_2023_2;

use api_2023_2;

create table if not exists usuario(
	user_id int primary key auto_increment,
    user_nome varchar(50),
    user_sobrenome varchar(50),
    user_cpf varchar(15),
    user_email varchar(50),
    user_telefone varchar(15),
    user_senha varchar(8)
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

create table if not exists cliente(
	cli_id int primary key auto_increment,
    user_id int unique, 
		foreign key (user_id) references usuario(user_id)
);

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

create table if not exists atendente(
	ate_id int primary key auto_increment,
	ate_turno varchar(15),
    user_id int unique, 
		foreign key (user_id) references usuario(user_id)
);

create table if not exists administrador(
	adm_id int auto_increment,
	user_id int unique, 
    primary key (adm_id),
	foreign key (user_id) references usuario(user_id)
);

create table if not exists mensagem(
	msg_id int primary key auto_increment,
    msg_texto varchar(255),
	msg_tipo_usuario varchar(255),
    msg_hora_envio datetime(6),
	cha_id int,
		foreign key (cha_id) references chamada(cha_id),
	user_id int,
		foreign key (user_id) references usuario(user_id)
);

create table if not exists problema (
	pro_id int primary key auto_increment,
    pro_desc varchar(255),
    tema_id int,
    foreign key (tema_id) references tema(tema_id)
);

create table if not exists solucao (
	sol_id int primary key auto_increment,
    sol_desc varchar(500),
    pro_id int,
    foreign key (pro_id) references problema(pro_id)
);