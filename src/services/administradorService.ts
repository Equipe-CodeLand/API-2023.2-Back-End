import { AppDataSource } from "../config/data-source";
import Administrador from "../entities/administador.entity";

const administradorRepository = AppDataSource.getRepository(Administrador)

export async function buscarTodosAdministradores() {
    return administradorRepository.find()
}