use api_2023_2;

select * from usuario;

select * from chamada;

## Select para fazer o painel de chamadas (Visão do sistema)
select user_nome,cha_tema,sta_nome,pri_nome,cha_inicio,user_email,cha_desc from usuario u
	inner join cliente cl on u.user_id = cl.user_id
    inner join chamada ch on ch.cli_id = cl.cli_id
    inner join stats s on s.sta_id = ch.sta_id
    inner join prioridade p on p.pri_id = ch.pri_id;

## Select para fazer o painel de chamadas (Visão do cliente)
select user_nome,cha_tema,sta_nome,pri_nome,cha_inicio,cha_desc from usuario u
	inner join atendente a on a.user_id = u.user_id
    inner join atendente_chamada ac on ac.ate_id = a.ate_id
    inner join chamada ch on ch.cha_id = ac.cha_id
    inner join stats s on s.sta_id = ch.sta_id
    inner join prioridade p on p.pri_id = ch.pri_id;