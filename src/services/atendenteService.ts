import { AppDataSource } from "../config/data-source";
import Atendente from "../entities/atendente.entity";

const atendenteRepository = AppDataSource.getRepository(Atendente)

export async function buscarTodosAtendentes() {
    return atendenteRepository.find()
}
