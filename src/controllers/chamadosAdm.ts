import { getChamadoRepository } from "../config/data-source";
import Chamado from "../entities/chamado.entity";

export async function obterChamados() {
  const chamadoRepository = getChamadoRepository();

  try {
    const chamados = await chamadoRepository.find();
    return chamados;
  } catch (error) {
    throw new Error(`Erro ao obter os chamados: ${error.message}`);
  }
}
