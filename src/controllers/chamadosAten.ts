const db = require("../config/database.ts");
/*export async function obterChamados() {
    let con = await conn();
    var sql = "SELECT * FROM atendente";

    return con.promise().query(sql);
}*/
export async function pegarChamado(){
    let sql = `select user_nome,user_sobrenome,cha_tema,sta_nome,pri_nome,cha_inicio,user_email,cha_desc from usuario u
	inner join cliente cl on u.user_id = cl.user_id
    inner join chamada ch on ch.cli_id = cl.cli_id
    inner join stats s on s.sta_id = ch.sta_id
    inner join prioridade p on p.pri_id = ch.pri_id;`;
    let resultado = await db.connect.promise().query(sql)
    return resultado[0]
}

export async function buscarChamadosPorAtendente(id: string) {
    let sql = `select * from chamada c 
    inner join atendente_chamada ac on c.cha_id = ac.ate_id
    inner join cliente cl on cl.cli_id = c.cli_id
    inner join stats s on s.sta_id = c.sta_id
    inner join usuario u on cl.user_id = u.user_id
    inner join prioridade p on p.pri_id = c.pri_id
    where ac.ate_id = ${id}`
    let resultado = await db.connect.promise().query(sql)
    return resultado[0]
}