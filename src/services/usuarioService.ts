import { AppDataSource } from "../config/data-source";
import Usuario from "../entities/usuario.entity";

const usuarioRepository = AppDataSource.getRepository(Usuario)

export async function buscarUsuario(id: number) {
    return usuarioRepository.findOneBy({id: id})
}

export async function buscarTodosUsuarios() {
    return usuarioRepository.find()
}

export async function cadastrarUsuario(usuario: Usuario) {
    return usuarioRepository.save(usuario)
}

export async function checkUsuario(cpf) {
    const usuario = await usuarioRepository.findOne({ where: { cpf } });
    return usuario;
}