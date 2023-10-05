/* Vincular o banco de dados aqui (da mesma forma como fizemos com o app.py na sprint passada) */
const fs = require('fs');
const path = require("path");

export async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:admin@localhost:3306/?multipleStatements=true");
    global.connection = connection;
    return connection;
}

export async function init() {
    let conn = await this.connect()
    conn.query(fs.readFileSync(path.join(__dirname, '../db/tabelas.sql')).toString())
}