var mysql = require('mysql2');

var conn = mysql.createConnection({
    host:'localhost',
    user: 'root',
    // password: 'coloque sua senha aqui',
    database: 'api_2023_2'
});

function init() {
    // Inicializações após a conexão ser estabelecida
    // Por exemplo:
    console.log('Inicialização após a conexão');
}

module.exports = {
    connect: conn.connect.bind(conn), 
    init: init
};