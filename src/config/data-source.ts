import { DataSource, getConnection } from "typeorm";
import Chamado from "../entities/chamado.entity"; // Importe a entidade Chamado
import { criarChamado } from "../services/chamadoService";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "fatec",
    database: "testando",
    timezone: 'Z',
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    subscribers: [],
    migrations: [],
});

// Inclua a função para obter o repositório de Chamado
export const getChamadoRepository = () => AppDataSource.getRepository(Chamado);