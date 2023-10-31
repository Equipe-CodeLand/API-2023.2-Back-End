use api_2023_2;

#Adicionando Status
insert into stats(sta_nome) values ("Não Iniciada");
insert into stats(sta_nome) values ("Em Andamento");
insert into stats(sta_nome) values ("Cancelada");
insert into stats(sta_nome) values ("Concluída");

#adicionando Prioridades
insert into prioridade(pri_nome) values ("Alta");
insert into prioridade(pri_nome) values ("Média");
insert into prioridade(pri_nome) values ("Baixa");

#Inserts para testar o banco
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone) values ('Felipe','Vieira','123.456.789-01','felipe27092005@gmail.com','(12) 99999-9999');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone) values ('Letícia','Helena','643.927.027-10','leticiafatec37@gmail.com','(12) 98888-8888');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone) values ('Pedro','Souza','384.420.740-11','pedrohenrique@gmail.com','(12) 93657-0275');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone) values ('Iago','Cardoso','123.456.549-01','iago@gmail.com','(12) 99347-9486');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone) values ('Caio','Rodrigues','643.949.457-10','caio@gmail.com','(12) 98778-8878');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone) values ('Luiz Felipe','Santos','384.460.773-11','luiz@gmail.com','(12) 93655-0655');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone) values ('Laura','Gonçalves','204.829.753-18','eulauragabriel@gmail.com','(12) 98643-9753');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone) values ('Livia','Faria','493.954.497-15','livia.faria01@fatec.sp.gov.br','(12) 97618-4682');

insert into cliente(user_id) values (1);
insert into cliente(user_id) values (2);
insert into cliente(user_id) values (3);

insert into atendente(user_id, ate_turno) values (4,'Matutino');
insert into atendente(user_id, ate_turno) values (5,'Integral');
insert into atendente(user_id, ate_turno) values (6,'Vespertino');

insert into administrador(user_id) values (7);
insert into administrador(user_id) values (8);

insert into chamada(cha_tema,cha_desc,cha_inicio,cli_id, sta_id, pri_id) values ("Velocidade da Internet",
 "Minha internet anda muito lenta esses dias, não consigo trabalhar",
 now(),1,2,1);
 
insert into chamada(cha_tema,cha_desc,cha_inicio,cli_id, sta_id, pri_id) values ("Modem",
 "Meu modem está com uma das luses piscando e faz um barulho como se tivesse uma peça solta dentro dele",
 now(),2,1,2);

insert into chamada(cha_tema,cha_desc,cha_inicio,cli_id, sta_id, pri_id) values ("Sem acesso à Internet",
 "Não estou conseguindo acessar a minha internet!",
 now(),2,2,3);

insert into mensagem(msg_texto, cha_id, user_id, msg_tipo_usuario, msg_hora_envio) values (
    "Minha internet anda muito lenta esses dias, não consigo trabalhar", 1, 1, 'Cliente', now()
)
insert into mensagem(msg_texto, cha_id, user_id, msg_tipo_usuario, msg_hora_envio) values (
    "Iremos enviar um técnico para verificar", 1, 4, 'Atendente', now()
)
insert into mensagem(msg_texto, cha_id, user_id, msg_tipo_usuario, msg_hora_envio) values (
    "Não estou conseguindo acessar a minha internet!", 3, 3, 'Cliente', now()
)


