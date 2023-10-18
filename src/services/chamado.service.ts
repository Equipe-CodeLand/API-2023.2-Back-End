import { AppDataSource } from "../config/data-source";
import Chamado from "../entities/chamado.entity";
import Status from "../entities/status.entity";
import { buscarCliente } from "./cliente.service";

const chamadoRepository = AppDataSource.getRepository(Chamado)
const statusRepository = AppDataSource.getRepository(Status)

export async function criarChamado(idCliente: number, tema: string, desc: string) {
    const cliente = await buscarCliente(idCliente)
    const status = await statusRepository.findOneBy({id: 1})
    return await chamadoRepository.save(new Chamado(tema, desc, cliente, status))
}