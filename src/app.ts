import express from 'express';
const path = require("path");

const app = express();
const port = 3000;
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'ejs')

app.get('/formulario', (req, res) => {
  res.render('formulario');
});

app.get('/temas', (req, res) => {
  res.render('temas');
});


app.listen(port, () => {
return console.log(`Express server is listening at http://localhost:${port}`);
});