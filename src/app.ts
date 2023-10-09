import express from 'express';
import index from './routes/index';
const db = require("./config/database.js");
const cors = require('cors')

const app = express();
const port = 5000;

app.use(cors())

db.connect(function(err){
    if (err) throw err;
    console.log('Conexão realizada com sucesso');
    db.init(); // Chama a função init após a conexão ser estabelecida
});

app.get('/',(re,res)=>{
    return res.json('Back-End')
})

/*app.get('/chamados', (req, res) => {
    const sql = 'SELECT * FROM atendente';

    db.query(sql, (err, data) => {
        if (err) {
            return res.json(err);
        }

        return res.json(data);
    });
});*/
app.listen(port, () => {
    console.log(`Express server is listening at http://localhost:${port}`);
});