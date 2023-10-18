import { AppDataSource } from "../config/data-source";
import Usuario from "../entities/usuario.entity";

const usuarioRepository = AppDataSource.getRepository(Usuario)

export async function buscarUsuario(id: number) {
    const usuario = await usuarioRepository.findOneBy({id: id})
    return usuario
}

export async function criarUsuario(usuario: Usuario) {
    return await usuarioRepository.save(usuario)
}