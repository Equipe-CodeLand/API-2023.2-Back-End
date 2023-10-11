import express, { json } from 'express';
import index from './routes/index';
import { arquivarCadastro } from './controllers/CadastroUser';
import { pegarChamado, buscarChamadosPorAtendente } from './controllers/chamadosAten';
const db = require("./config/database.ts");
const cors = require('cors')

const app = express();
const port = 5000;

app.use(cors())
app.use(json())

app.get('/',(req,res)=>{
    return res.json('Back-End')
})

app.get('/ChamadosAtendente',(req,res)=>{
    pegarChamado()
    .then(resultado=>{
        res.send(resultado)
    })
});

app.get('/atendenteChamados/:id', (req, res) => {
    buscarChamadosPorAtendente(req.params.id)
    .then(result => {
        return res.send(result)
    }) 
})

app.post('/cadastroUser', (req, res) => {
    console.log(req.body);
    arquivarCadastro(req.body.nome,req.body.sobrenome,req.body.cpf,req.body.email,req.body.tipo,req.body.telefone,req.body.turno, 
    );
  });

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