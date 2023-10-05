import { connect } from "../config/database";

export async function arquivarCadastro(nome:string, sobrenome:string, cpf:string,
    email:string,tipo:string,telefone:string,turno?:string) {
    let con = await connect()
    var sql = "Insert into usuario(user_nome, user_sobrenome, user_cpf, user_email, user_telefone) values (?,?,?,?,?)"
    con.query(sql, [nome,sobrenome,cpf,email,telefone])
    switch (tipo) {
        case "Cliente":
            sql = `Insert into cliente(user_id) values (select user_id from usuario where user_cpf="${cpf}" and user_email = "${email}" and user_telefone = "${telefone}")`
            break;
        case "Atendente":
            sql = `Insert into atendente(user_id, ate_turno) values (select user_id from usuario where user_cpf="${cpf}" and user_email = "${email}" and user_telefone = "${telefone}", "${turno}")`
            break;
        case "Administrador":
            sql = `Insert into administrador(user_id) values (select user_id from usuario where user_cpf="${cpf}" and user_email = "${email}" and user_telefone = "${telefone}"`
            break;
        default:
            break;
    }
    con.query(sql)
}


/*
Adicionar isso aqui no app.ts!!!!!

import arquivarCadastro from '*Coloque aqui a rota até o arquivo CadastroUser.ts*'

app.use(json());

app.post('/cadastroUser', (req, res) => {
  arquivarCadastro(req.body, (err: any) => {
    if (err) throw err;
  });
});

*/