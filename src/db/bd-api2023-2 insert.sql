use api_2023_2;

insert into usuario(user_id, user_nome, user_email) values(1,'nome1','email1');
insert into usuario(user_id, user_nome, user_email) values(2,'nome2','email2');
insert into usuario(user_id, user_nome, user_email) values(3,'nome3','email3');

insert into chamada(cha_id, cha_tema, cha_desc, cha_inicio, cha_final, user_id) values (1, 'tema1', 'desc1',curdate(), null, 1);
insert into chamada(cha_id, cha_tema, cha_desc, cha_inicio, cha_final, user_id) values (2, 'tema2', 'desc2',curdate(), null, 2);
insert into chamada(cha_id, cha_tema, cha_desc, cha_inicio, cha_final, user_id) values (3, 'tema3', 'desc3',curdate(), null, 3);
insert into chamada(cha_id, cha_tema, cha_desc, cha_inicio, cha_final, user_id) values (4, 'tema4', 'desc4',curdate(), null, 1);
insert into chamada(cha_id, cha_tema, cha_desc, cha_inicio, cha_final, user_id) values (5, 'tema5', 'desc5',curdate(), null, 2);
insert into chamada(cha_id, cha_tema, cha_desc, cha_inicio, cha_final, user_id) values (6, 'tema6', 'desc6',curdate(), null, 3);