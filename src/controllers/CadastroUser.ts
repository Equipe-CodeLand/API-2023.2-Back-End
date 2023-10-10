const db = require("../config/database.js");

export async function arquivarCadastro(nome, sobrenome, cpf, email, tipo, telefone, turno) {
    try {
        const sql = `Insert into usuario(user_nome, user_sobrenome, user_cpf, user_email, user_telefone) values (?, ?, ?, ?, ?)`;
        await db.connect.promise().query(sql, [nome, sobrenome, cpf, email, telefone]);

        switch (tipo) {
            case "Cliente":
                const clienteSql = `INSERT INTO cliente (user_id) SELECT user_id FROM usuario WHERE user_cpf=? AND user_email=? AND user_telefone=?`;
                await db.connect.promise().query(clienteSql, [cpf, email, telefone]);
                break;
            case "Atendente":
                const atendenteSql = `INSERT INTO atendente (user_id, ate_turno) SELECT user_id, ? FROM usuario WHERE user_cpf=? AND user_email=? AND user_telefone=?`;
                await db.connect.promise().query(atendenteSql, [turno, cpf, email, telefone]);
                break;
            case "Administrador":
                const adminSql = `INSERT INTO administrador (user_id) SELECT user_id FROM usuario WHERE user_cpf=? AND user_email=? AND user_telefone=?`;
                await db.connect.promise().query(adminSql, [cpf, email, telefone]);
                break;
            default:
                throw new Error('Tipo inválido');
        }
    } catch (error) {
        throw error;
    }
}
