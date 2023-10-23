import { AppDataSource } from "../config/data-source";
import Usuario from "../entities/usuario.entity";

const usuarioRepository = AppDataSource.getRepository(Usuario)

export async function buscarUsuario(id: number) {
    return usuarioRepository.findOneBy({id: id})
}

export async function buscarUsuarioPorEmail(email: string) {
    return usuarioRepository.findOneBy({email: email})
}

export async function cadastrarUsuario(usuario: Usuario) {
    return usuarioRepository.save(usuario)
}