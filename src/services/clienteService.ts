import { AppDataSource } from "../config/data-source";
import Cliente from "../entities/cliente.entity";
import Usuario from "../entities/usuario.entity";
import { buscarUsuario, cadastrarUsuario } from "./usuarioService";

const clienteRepository = AppDataSource.getRepository(Cliente)

export async function buscarCliente(id: number) {
    return clienteRepository.findOneBy({id: id})
}

export async function buscarTodosClientes() {
    return clienteRepository.find()
}

export async function criarCliente(usuario: Usuario) {
    const usuarioCriado = await cadastrarUsuario(usuario)
    return clienteRepository.save(new Cliente(usuarioCriado))
}

export async function cadastrarCliente(idUsuario: number) {
    const usuario = await buscarUsuario(idUsuario)
    return clienteRepository.save(new Cliente(usuario))
}