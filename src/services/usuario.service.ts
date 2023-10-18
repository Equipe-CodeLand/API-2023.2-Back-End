import { AppDataSource } from "../config/data-source";
import Usuario from "../entities/usuario.entity";

const usuarioRepository = AppDataSource.getRepository(Usuario)


export async function buscarUsuario(id: number) {
    return await usuarioRepository.findOneBy({id: id})
}

export async function cadastrarUsuario(usuario: Usuario) {
    return await usuarioRepository.save(usuario)
}