use api_2023_2;

select * from usuario;
select * from chamada;


-- Junção tabelas usuario e chamada (Vai mostrar tudo menos os ids de ambas as tabelas)
select u.user_nome,u.user_email, c.cha_tema, c.cha_desc, c.cha_inicio, c.cha_final 
	from usuario u, chamada c 
		where c.user_id = u.user_id;

-- Selecionando somente as chamadas de um cliente em específico
select u.user_nome,u.user_email, c.cha_tema, c.cha_desc, c.cha_inicio, c.cha_final 
	from usuario u, chamada c 
		where c.user_id = u.user_id and c.user_id = 1;