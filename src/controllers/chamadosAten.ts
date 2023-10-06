export async function obterChamados() {
    let con = await conn();
    var sql = `select user_nome,user_sobrenome,cha_tema,sta_nome,pri_nome,cha_inicio,user_email,cha_desc from usuario u
	inner join cliente cl on u.user_id = cl.user_id
    inner join chamada ch on ch.cli_id = cl.cli_id
    inner join stats s on s.sta_id = ch.sta_id
    inner join prioridade p on p.pri_id = ch.pri_id;`;

    return new Promise((resolve, reject) => {
        con.query(sql, function(err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}