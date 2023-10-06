import express from 'express';
import index from './routes/index';
const db = require("./config/database.js");

const app = express();
const port = 5000;

db.connect(function(err){
    if (err) throw err;
    console.log('Conexão realizada com sucesso');
    db.init(); // Chama a função init após a conexão ser estabelecida
});

app.use('/chamados', index); 

app.listen(port, () => {
    console.log(`Express server is listening at http://localhost:${port}`);
});