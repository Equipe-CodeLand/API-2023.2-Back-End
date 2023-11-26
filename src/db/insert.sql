use api_2023_2;

#Adicionando Status
insert into stats(sta_nome) values ("Não Iniciada");
insert into stats(sta_nome) values ("Em Andamento");
insert into stats(sta_nome) values ("Cancelada");
insert into stats(sta_nome) values ("Concluída");

-- adicionando o Tema
insert into tema(tema_nome) values ('Velocidade da internet');
insert into tema(tema_nome) values ('Modem');
insert into tema(tema_nome) values ('Outros');
insert into tema(tema_nome) values ('Problemas de conexão');

#adicionando Prioridades
insert into prioridade(pri_nome) values ("Alta");
insert into prioridade(pri_nome) values ("Média");
insert into prioridade(pri_nome) values ("Baixa");


select * from usuario;

#Inserts para testar o banco
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Felipe','Vieira','123.456.789-01','felipe27092005@gmail.com','(12) 99999-9999','fel123');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Letícia','Helena','643.927.027-10','leticiafatec37@gmail.com','(12) 98888-8888','let123');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Pedro','Souza','384.420.740-11','pedrohenrique@gmail.com','(12) 93657-0275','ped123');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Iago','Cardoso','123.456.549-01','iago@gmail.com','(12) 99347-9486','iago123');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Caio','Rodrigues','643.949.457-10','caio@gmail.com','(12) 98778-8878','caio123');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Luiz Felipe','Santos','384.460.773-11','luiz@gmail.com','(12) 93655-0655','luiz123');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Laura','Gonçalves','204.829.753-18','eulauragabriel@gmail.com','(12) 98643-9753','laura123');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Livia','Faria','493.954.497-15','livia.faria01@fatec.sp.gov.br','(12) 97618-4682','livia123');
insert into usuario(user_nome,user_sobrenome,user_cpf,user_email,user_telefone,user_senha) values ('Admin','Admin','498.956.496-16','admin@admin','(12) 87685-4652','admin');


insert into cliente(user_id) values (1);
insert into cliente(user_id) values (2);
insert into cliente(user_id) values (3);

insert into atendente(user_id, ate_turno) values (4,'Matutino');
insert into atendente(user_id, ate_turno) values (5,'Integral');
insert into atendente(user_id, ate_turno) values (6,'Vespertino');

insert into administrador(user_id) values (7);
insert into administrador(user_id) values (8);
insert into administrador(user_id) values (9);


insert into chamada(cha_desc,cha_inicio,cli_id, sta_id, pri_id, tema_id) values (
 "Minha internet anda muito lenta esses dias, não consigo trabalhar",
 now(),1,2,1,1);

insert into chamada(cha_desc,cha_inicio,cli_id, sta_id, pri_id) values (
 "Não estou conseguindo acessar a minha internet!",
 now(),2,2,3,4);

insert into mensagem(msg_texto, cha_id, user_id, msg_tipo_usuario, msg_hora_envio) values (
    "Minha internet anda muito lenta esses dias, não consigo trabalhar", 1, 1, 'Cliente', now()
);

insert into mensagem(msg_texto, cha_id, user_id, msg_tipo_usuario, msg_hora_envio) values (
    "Não estou conseguindo acessar a minha internet!", 3, 3, 'Cliente', now()
);
/* Inserindo Problemas conhecidos*/

INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('1', 'Minha internet está ruim', 1);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('2', 'Estou sem acesso à internet', 1);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('3', 'Não estou conseguindo acessar minha rede WIFI', 1);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('4', 'Minha internet não está funcionando', 1);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('5', 'Não consigo conectar a Internet quando a luz do modem está piscando ou apagada.', 2);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('6', 'Luzes indicadoras do modem não estão acessas', 2);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('7', 'Problemas do aquecimento do modem', 2);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('8', 'Meu sinal está fraco', 2);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('9', 'Ao conectar à internet, aparece velocidade diferente da contratada, porque isso acontece?', 4);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('10', 'Wifi-Lento', 4);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('11', 'Problemas de Interferência', 4);
INSERT INTO problema(pro_id, pro_desc, tema_id) VALUES ('12', 'Downloads ou streaming lentos em horários de pico', 4);

/* Inserindo Soluções conhecidos */

INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('1', 'Use um site confiável de teste de velocidade para verificar a velocidade atual da sua conexão. Se o problema persistir, entre em contato com o suporte técnico do seu provedor de serviços de Internet.', 1);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('2', 'Verifique o site ou as redes sociais do seu provedor de serviços de Internet para ver se há relatos de interrupções na sua área.', 2);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('3', 'Conecte um dispositivo diretamente ao modem usando um cabo Ethernet para ver se você obtém acesso à Internet. Se o problema persistir, entre em contato com o provedor da sua Internet.', 2);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('4', 'Desligue o modem e reinicie após alguns segundos. Espere até as luzes do modem acenderem e tente conectar novamente.', 3);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('5', 'Se ocorrer lentidão ou alguma outra dificuldade relacionada à conexão, desligue o equipamento da energia elétrica por cerca de 2 minutos. Se o problema persistir, entre em contato com o suporte técnico.', 4);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('6', 'Se a luz do modem está piscando, indica instabilidade no sinal. Se está apagada, demonstra a interrupção da transmissão do sinal. Para tentar arrumar, desligue o modem e reinicie após alguns segundos.', 5);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('7', 'Verifique se o modem está corretamente ligado na tomada e se o cabo de energia está funcionando. Tente usar outra tomada, se possível. Se as luzes ainda não acenderem, o modem pode estar com defeito.', 6);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('8', 'Certifique-se de que o modem tenha espaço suficiente ao redor para ventilação adequada. Evite colocá-lo em um local exposto à luz solar direta ou próximo de fontes de calor.', 7);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('9', 'Posicione o modem em um local central da casa para obter o melhor alcance de sinal. Considere a possibilidade de usar repetidores ou extensores de sinal Wi-Fi, se necessário.', 8);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('10', 'Pode ser:', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('11', 'Repetidor de mercado que pode comprometer a quantidade da velocidade;', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('12', 'Roteador instalado perto de aparelhos sem fio que podem interferir no sinal;', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('13', 'Longa distância do roteador com o aparelho conectado;', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('14', 'Barreiras físicas;', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('15', 'Interferência de sinal causada por outros aparelhos;', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('16', 'Muitas pessoas conectadas ao mesmo tempo;', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('17', 'Qualidade da fiação do imóvel;', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('18', 'Capacidade do processamento do computador.', 9);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('19', 'Posicione o roteador em um local central da casa, longe de obstruções. Evite interferências de dispositivos eletrônicos e mantenha o firmware do roteador atualizado. Considere investir em um roteador mais potente se necessário.', 10);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('20', 'Mude o canal Wi-Fi para um menos congestionado nas configurações do roteador.', 11);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('21', 'Experimente usar a internet em horários menos congestionados. Se possível, considere a possibilidade de fazer upgrade no plano com maior largura de banda.', 12);
INSERT INTO solucao(sol_id, sol_desc, pro_id) VALUES ('22', 'Capacidade máxima da velocidade recebida pela placa de rede.', 9);
