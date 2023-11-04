import { getRepository } from "typeorm";
import { AppDataSource, getChamadoRepository } from "../config/data-source";
import Chamado from "../entities/chamado.entity";
import Prioridade from "../entities/prioridade.entity";
import Status from "../entities/status.entity";
import Tema from "../entities/tema.entity";
import { buscarAtendentePorUserId } from "./atendenteService";
import { NextFunction } from "express-serve-static-core";
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { Request } from 'express';
import { buscarUsuario } from "./usuarioService";
import { buscarClientePorUserId } from "./clienteService";

const chamadoRepository = AppDataSource.getRepository(Chamado)
const statusRepository = AppDataSource.getRepository(Status)
const prioridadeRepository = AppDataSource.getRepository(Prioridade)
const temaRepository = AppDataSource.getRepository(Tema)

export async function criarChamado(req: Request) {
    try {
      // Busca o cliente usando a requisição
      const cliente = await buscarClientePorUserId(req.body.userId)
      console.log(cliente)
      console.log(req.body);
      
      const idTema = parseInt(req.body.idTema); // Converte idTema para número
      const desc = req.body.desc;
      
      const status = await statusRepository.findOneBy({id: 1})
      const tema = await temaRepository.findOneBy({id:idTema})
      console.log(tema);
      const prioridade = await definirPrioridade(tema);
      console.log(prioridade);
      
      console.log(`idTema recebido: ${idTema}`);
      
      return chamadoRepository.save(new Chamado(tema, desc, cliente, status, prioridade));
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar chamado');
    }
}

export async function buscarChamado(id: number) {
    return chamadoRepository.findOneBy({id: id})
}

async function buscarTodosChamados() {
    try {
        const chamados = await buscarTodosChamados(); 
        return chamados;
    } catch (error) {
        throw new Error(`Erro ao buscar chamados: ${error.message}`);
    }
}
async function buscarChamadosComInformacoes() {
    const chamados = await getChamadoRepository().find({
        select:{
            "id":true,
            "tema":{
                id: true,
                nome: true
            },
            "inicio":true,
            "final":true,
            "desc":true,
            'status':{
                id: true,
                nome: true
            },
            'prioridade':{
                id: true,
                nome: true
            },
            "cliente":{
                "usuario":{
                    id: true,
                    nome: true,
                    email: true
                }
            }},
        relations:{
            cliente: {usuario: true},
            status: true,
            prioridade: true,
            tema: true
        }
    });
    return chamados;
}

export async function buscarChamadosAtendente(id: number) {
    let atendente = await buscarAtendentePorUserId(id)
    return chamadoRepository.find({
        select:{
            "id":true,
            "tema":{
                id: true,
                nome: true
            },
            "inicio":true,
            "final":true,
            "desc":true,
            'status':{
                id: true,
                nome: true
            },
            'prioridade':{
                id: true,
                nome: true
            },
            "cliente":{
                "usuario":{
                    id: true,
                    nome: true,
                    email: true
                }
            }},
        relations:{
            cliente: {usuario: true},
            status: true,
            prioridade: true,
            tema: true
        },
        where: {atendente: {id: atendente.id}}
    })
}

export async function buscarChamadosComInformacoesCli() {
    const chamadosCli = await getChamadoRepository().find({
        select:{
            "id":true,
            "tema":{
                id: true,
                nome: true
            },
            "inicio":true,
            "final":true,
            "desc":true,
            'status':{
                id: true,
                nome: true
            },
            "atendente":{
                "usuario":{
                    id: true,
                    nome: true,
                }
            }},
        relations:{
            atendente: {usuario: true},
            status: true,
            tema: true,
        }
    });
    return chamadosCli;
}

export async function definirPrioridade(tema: Tema) {
    switch(tema.nome){
        case 'Sem acesso a internet':
            return await prioridadeRepository.findOneBy({id:1})
        case 'Modem':
            return await prioridadeRepository.findOneBy({id:2})
        case 'Outros':
            return await prioridadeRepository.findOneBy({id:2})
        case 'Velocidade da internet':
            return await prioridadeRepository.findOneBy({id:3})
        default:
            return null
    }

}

export async function andamentoChamado(idChamado: number) {
    const chamado = await buscarChamado(idChamado)
    const status = await statusRepository.findOneBy({id: 2})
    
    chamado.status = status

    await chamadoRepository.save(chamado)

    return chamado
}

export async function finalizarChamado(idChamado: number, idStatus: number) {
    const chamado = await buscarChamado(idChamado)
    const status = await statusRepository.findOneBy({id: idStatus})
    
    chamado.status = status

    chamado.final = new Date()

    await chamadoRepository.save(chamado)

    return chamado
}

export async function dropdownChamados() {
    const chamados = await getChamadoRepository().find({
        select:{
            "id":true,
            "desc":true,
            "cliente":{
                "usuario":{
                    id: true,
                    nome: true,
                    email: true
                }
            },
        'mensagens':{
            texto: true
        }},
        relations:{
            cliente: {usuario: true},
            mensagens: {usuario: true},
        }
    })
    return chamados;
}

export default buscarChamadosComInformacoes