import Chamado from "../entities/chamado.entity";
import { AppDataSource } from "../config/data-source";

const chamadoRepository = AppDataSource.getRepository(Chamado);

export async function buscarTodosChamados() {
    try {
        const chamados = await chamadoRepository.find();
        return chamados;
    } catch (error) {
        throw new Error(`Erro ao buscar chamados: ${error.message}`);
    }
}
