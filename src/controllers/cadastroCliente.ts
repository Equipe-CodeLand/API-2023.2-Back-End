const db = require('../config/database')

export async function arquivarCadastroCli(nome, sobrenome, cpf, email, telefone, tema, mensagem, res) {
    try {
        const userQuery = "INSERT INTO usuario (user_nome, user_sobrenome, user_cpf, user_telefone, user_email) VALUES (?, ?, ?, ?, ?)";
        const [userResult] = await db.connect.promise().query(userQuery, [nome, sobrenome, cpf, telefone, email]);
        const userId = userResult.insertId;

        const clienteQuery = `INSERT INTO cliente (user_id) VALUES (?)`;
        const [clienteResult] = await db.connect.promise().query(clienteQuery, [userId]);
        const clientId = clienteResult.insertId;

        const chamadaQuery = `INSERT INTO chamada (cha_tema, cha_desc, cli_id, sta_id, pri_id,cha_inicio) VALUES (?, ?, ?,1,1,?)`;
        const [chamadaResult] = await db.connect.promise().query(chamadaQuery, [tema, mensagem, clientId, new Date]);

        console.log(chamadaResult);
    } catch (error) {
        console.error(error);
    }
}
