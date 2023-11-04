import { AppDataSource } from "../config/data-source";
import Administrador from "../entities/administador.entity";
import Usuario from "../entities/usuario.entity";
import { cadastrarUsuario } from "./usuarioService";

const administradorRepository = AppDataSource.getRepository(Administrador)

export async function buscarTodosAdministradores() {
    return administradorRepository.find()
}

export async function criarAdministrador(usuario: Usuario) {
    const usuarioCriado = await cadastrarUsuario(usuario)
    return administradorRepository.save(new Administrador(usuarioCriado))
}