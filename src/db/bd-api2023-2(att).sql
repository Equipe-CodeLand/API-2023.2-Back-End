create database api_2023_2;

use api_2023_2;

-- tabela usuario(incompletas pois para a entrega da 1ªsprint não é necessário senha ou outras coisas)
create table if not exists usuario(
	user_id int primary key,
    user_nome varchar(80),
    user_email varchar(30),
    user_tel_ddd varchar(2),
    user_telefone varchar(9)
    /*
    user_senha varchar(8)
	*/
);



--tabela chamada, incompleta pois para a 1ª só é necessário um lugar para salvar o que for escrito
create table if not exists chamada(
	cha_id int primary key,
    cha_tema varchar(55),
    cha_desc varchar(255),
    cha_inicio datetime,
    cha_final datetime,
    user_id int not null,
		foreign key (user_id) references usuario(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);



-- Estas tabelas estão comentadas, pois serão desnecessárias para a 1ª sprint já que não terá nenhum sistema de login ou resposta das chamadas

/* ##Tabela endereço
create table if not exists endereco(
	end_cep int primary key not null,
    end_bairro varchar(30),
    end_rua varchar(30),
    end_cidade varchar(80),
    end_estado varchar(2)
);

##tabela cliente, dependente da tabela usuario
create table if not exists cliente(
	cli_id int primary key not null,
	cli_cpf varchar(11) not null,
    cli_telefone int,
    cli_descricao varchar(990),
    foreign key (endereco_cep) references endereco(cep),
    user_id int not null primary key, 
		foreign key (user_id) references usuario(user_id)
);

##tabela funcionario, dependente da tabela usuario
create table if not exists funcionario(
	func_id int primary key not null,
    func_turno_inicio time,
    func_turno_fim time,
    user_id int not null primary key, 
		foreign key (user_id) references usuario(user_id)
);

##table adm, dependente da tabela usuario
create table if not exists administrador(
	adm_id int primary key,
    adm_cpf int,
	user_id int not null primary key, 
		foreign key (user_id) references usuario(user_id)
);

## relacionamento de muitos para muitos, ou seja vários funcionários podem atender à diferentes ou a mesma chamada
create table funcionario_chamada(
	func_id int,
		foreign key (func_id) references funcionario(func_id),
	cha_id int,
		foreign key(cha_id) references chamada(cha_id)
);


create table if not exists resposta(
	res_id int primary key,
    res_desc varchar(255),
	cliente_id int,
		foreign key (cliente_id) references cliente(cliente_id),
	funcionario_id int,
		foreign key (func_id) references funcionario(func_id),
	cha_id int,
		foreign key (cha_id) references chamada(cha_id)
);

*/

