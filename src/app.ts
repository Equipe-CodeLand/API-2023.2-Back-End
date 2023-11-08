import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import router from "./routes";

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    }).catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Express server is listening at http://localhost:${PORT}`);
});
