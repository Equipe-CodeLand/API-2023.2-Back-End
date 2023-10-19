import { AppDataSource } from "../config/data-source";
import Mensagem from "../entities/mensagem.entity";
import { buscarChamado } from "./chamadoService";
import { buscarUsuario } from "./usuarioService";

const mensagemRepository = AppDataSource.getRepository(Mensagem)

export async function enviarMensagem(texto: string, idChamado: number, idUsuario: number, tipoUsuario: string) {

    const chamado = await buscarChamado(idChamado)
    const usuario = await buscarUsuario(idUsuario)

    return mensagemRepository.save(new Mensagem(texto, chamado, usuario, tipoUsuario))
}