import { AppDataSource } from "../config/data-source";
import Cliente from "../entities/cliente.entity";
import Usuario from "../entities/usuario.entity";
import { buscarUsuario, cadastrarUsuario } from "./usuarioService";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const clienteRepository = AppDataSource.getRepository(Cliente)

/*export async function buscarCliente(req: Request) {
    try {
        console.log(req);
        if (!req || !req.headers) {
          throw new Error('Requisição ou cabeçalho não fornecido');
        }
        const token = req.headers['authorization']?.replace('Bearer ', '');
        console.log('Token recebido:', token); 
        if (!token) {
          throw new Error('Token não fornecido');
        }
        try {
            const decoded = jwt.verify(token, 'decodeToken') as { userId: number; email: string; cargo: string };
            
            console.log(decoded);

            const idCliente = decoded; 
            if (typeof idCliente !== 'number') {
                throw new Error('idCliente deve ser um número');
              }              
            console.log(idCliente)
            // Busca o cliente pelo ID
            const cliente = await clienteRepository
            .createQueryBuilder('cliente')
            .where('cliente.id = :id', { id: idCliente })
            .getOne();
            
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
              
            return cliente;
          } catch (error) {
            console.error(error);
          }
    } catch(error){
        console.error(error);
        throw new Error('Erro ao buscar o cliente');
    }
}*/
export async function buscarClientePorUserId(userId: number) {
  return clienteRepository.findOneBy({usuario: {id: userId}});
}

export async function buscarTodosClientes() {
    return clienteRepository.find()
}

export async function criarCliente(usuario: Usuario) {
    const usuarioCriado = await cadastrarUsuario(usuario)
    return clienteRepository.save(new Cliente(usuarioCriado))
}

/*export async function cadastrarCliente(idUsuario: number) {
    const usuario = await buscarUsuario(idUsuario)
    return clienteRepository.save(new Cliente(usuario))
}*/