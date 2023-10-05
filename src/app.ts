import express from 'express';
const db = require("./config/database.ts");


const app = express();
const port = 5000;
db.connect()
db.init()

app.listen(port, () => {
return console.log(`Express server is listening at http://localhost:${port}`);
});