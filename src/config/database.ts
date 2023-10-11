var mysql = require('mysql2');

var conn = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'admin',
    database: 'api_2023_2',
    multipleStatements: true
});

function init() {
    // Inicializações após a conexão ser estabelecida
    // Por exemplo:
    console.log('Inicialização após a conexão');
}

module.exports = {
    connect: conn, 
    init: init
};