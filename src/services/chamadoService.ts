import { In, getRepository } from "typeorm";
import { AppDataSource, getChamadoRepository } from "../config/data-source";
import Chamado from "../entities/chamado.entity";
import Prioridade from "../entities/prioridade.entity";
import Status from "../entities/status.entity";
import { buscarAtendente } from "./atendenteService";
import Tema from "../entities/tema.entity";
import { buscarAtendentePorUserId } from "./atendenteService";
import { NextFunction } from "express-serve-static-core";
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { Request } from 'express';
import { buscarUsuario } from "./usuarioService";
import { buscarClientePorUserId } from "./clienteService";
import { enviarMensagem } from "./mensagemService";

const chamadoRepository = AppDataSource.getRepository(Chamado)
const statusRepository = AppDataSource.getRepository(Status)
const prioridadeRepository = AppDataSource.getRepository(Prioridade)
const temaRepository = AppDataSource.getRepository(Tema)


export async function atribuirAtendente(idChamado: number, idAtendente: number){
    let chamado = await buscarChamado(idChamado);
    let atendente = await buscarAtendente(idAtendente);
    chamado.atendente = atendente
    console.log(atendente);
    console.log(chamado);
    const salvar = await chamadoRepository.save(chamado)
    await andamentoChamado(chamado.id)
    return salvar
}

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
      
      let chamado = await chamadoRepository.save(new Chamado(tema, desc, cliente, status, prioridade));
      
      
      enviarMensagem(desc,chamado.id,req.body.userId,'Cliente')
      return chamado
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
async function buscarChamadosComInformacoes(tema:Array<any>,status:Array<any>,prioridade:Array<any>) {
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
        },
        where: {
            tema: tema.length > 0 ? { id: In(tema) } : undefined,
            status: status.length > 0 ? { id: In(status) } : undefined,
            prioridade: prioridade.length > 0 ? { id: In(prioridade) } : undefined
        },
        order: {
            inicio: 'ASC'
        }
    });
    return chamados;
}

export async function buscarChamadosAtendente(id: number,tema:Array<any>,status:Array<any>,prioridade:Array<any>) {
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
        where: {atendente: {id: atendente.id},
        tema: tema.length > 0 ? { id: In(tema) } : undefined,
        status: status.length > 0 ? { id: In(status) } : undefined,
        prioridade: prioridade.length > 0 ? { id: In(prioridade) } : undefined
    },
    order: {
        inicio: 'ASC'
    }
    })
}

export async function buscarChamadosCliente(id: number,tema:Array<any>,status:Array<any>,prioridade:Array<any>) {
    let cliente = await buscarClientePorUserId(id)    
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
            "atendente":{
                "usuario":{
                    id: true,
                    nome: true,
                    email: true
                }
            }},
        relations:{
            atendente: {usuario: true},
            status: true,
            tema: true
        },
        where: {cliente: {id: cliente.id},
        tema: tema.length > 0 ? { id: In(tema) } : undefined,
        status: status.length > 0 ? { id: In(status) } : undefined,
        prioridade: prioridade.length > 0 ? { id: In(prioridade) } : undefined
    },
    order: {
        inicio: 'ASC'
    }
    })
}

//parte do pedro começa aqui
export async function atualizarPrioridade(chamada: Chamado) {
    const agora = new Date();
    const tempoDecorrido = Math.floor((agora.getTime() - chamada.inicio.getTime()) / 60000); // tempo decorrido em minutos

    if (tempoDecorrido >= 3 && chamada.prioridade.id > 1) {
        chamada.prioridade = await prioridadeRepository.findOneBy({id:1}); // Alta
    } else if (tempoDecorrido >= 2 && chamada.prioridade.id > 2) {
        chamada.prioridade = await prioridadeRepository.findOneBy({id:2}); // Média
    } else if (chamada.prioridade.id > 3) {
        chamada.prioridade = await prioridadeRepository.findOneBy({id:3}); // Baixa
    }

    // salvar a chamada atualizada
    await chamadoRepository.save(chamada);
}
//acaba aqui

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

    await statusRepository.save(chamado)

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