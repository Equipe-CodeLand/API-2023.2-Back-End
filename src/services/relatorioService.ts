import { Between } from "typeorm";
import { AppDataSource } from "../config/data-source";
import Chamado from "../entities/chamado.entity";
import Tema from "../entities/tema.entity";
import Prioridade from "../entities/prioridade.entity";
import Status from "../entities/status.entity";

const chamadoRepository = AppDataSource.getRepository(Chamado)
const temaRepository = AppDataSource.getRepository(Tema)
const prioridadeRepository = AppDataSource.getRepository(Prioridade)
const statusRepository = AppDataSource.getRepository(Status)

/*
[
    {
        "tema": {
            "nome": "Sem acesso a internet",
            "id": 1
        },
        "numeroChamados": 4,
        "tempoMedio": {
            "horas": 166,
            "minutos": 44
        }
    },
    {
        "tema": {
            "nome": "Modem",
            "id": 2
        },
        "numeroChamados": 2,
        "tempoMedio": {
            "horas": 0,
            "minutos": 20
        }
    },
    {
        "tema": {
            "nome": "Outros",
            "id": 3
        },
        "numeroChamados": 1,
        "tempoMedio": {
            "horas": 1,
            "minutos": 0
        }
    },
    {
        "tema": {
            "nome": "Velocidade da internet",
            "id": 4
        },
        "numeroChamados": 0,
        "tempoMedio": {
            "horas": null,
            "minutos": null
        }
    }
]  */
export async function chamadosPorTema(inicio: Date, final: Date) {
    const temas = await temaRepository.find()
    

    return Promise.all(temas.map(async (tema) => {
        return {
            tema: tema,
            numeroChamados: await chamadoRepository.count({
                where: {
                    tema: {id: tema.id},
                    inicio: Between(inicio, final)
                }
            }),
            tempoMedio: await tempoMedio('chamado.tema.id = :id', tema.id, inicio, final)
        }
    }))
}

/*
[
    {
        "status": {
            "nome": "Não Iniciada",
            "id": 1
        },
        "numeroChamados": 2,
        "tempoMedio": {
            "horas": 0,
            "minutos": 20
        }
    },
    {
        "status": {
            "nome": "Em Andamento",
            "id": 2
        },
        "numeroChamados": 5,
        "tempoMedio": {
            "horas": 111,
            "minutos": 29
        }
    },
    {
        "status": {
            "nome": "Cancelada",
            "id": 3
        },
        "numeroChamados": 0,
        "tempoMedio": {
            "horas": null,
            "minutos": null
        }
    },
    {
        "status": {
            "nome": "Concluída",
            "id": 4
        },
        "numeroChamados": 0,
        "tempoMedio": {
            "horas": null,
            "minutos": null
        }
    }
] */
export async function chamadosPorStatus(inicio: Date, final: Date) {
    const status = await statusRepository.find()    

    return Promise.all(status.map(async (stat) => {
        return {
            status: stat,
            numeroChamados: await chamadoRepository.count({
                where: {
                    status: {id: stat.id},
                    inicio: Between(inicio, final),
                }
            }),
            tempoMedio: await tempoMedio('chamado.status.id = :id', stat.id, inicio, final)
        }
    }))
}

/*
[
    {
        "prioridade": {
            "nome": "Alta",
            "id": 1
        },
        "numeroChamados": 4,
        "tempoMedio": {
            "horas": 0,
            "minutos": 35
        }
    },
    {
        "prioridade": {
            "nome": "Média",
            "id": 2
        },
        "numeroChamados": 2,
        "tempoMedio": {
            "horas": 0,
            "minutos": 20
        }
    },
    {
        "prioridade": {
            "nome": "Baixa",
            "id": 3
        },
        "numeroChamados": 1,
        "tempoMedio": {
            "horas": 333,
            "minutos": 19
        }
    }
] */
export async function chamadosPorPrioridade(inicio: Date, final: Date) {
    const prioridades = await prioridadeRepository.find()

    return Promise.all(prioridades.map(async (pri) => {
        return {
            prioridade: pri,
            numeroChamados: await chamadoRepository.count({
                where: {
                    prioridade: {id: pri.id},
                    inicio: Between(inicio, final)
                }
            }),
            tempoMedio: await tempoMedio('chamado.prioridade.id = :id', pri.id, inicio, final)
        }
    }))
}

/*
[
    {
        "turno": "Manhã",
        "numeroChamados": 0
    },
    {
        "turno": "Tarde",
        "numeroChamados": 3
    },
    {
        "turno": "Noite",
        "numeroChamados": 1
    },
    {
        "turno": "Madrugada",
        "numeroChamados": 0
    }
] */
export async function chamadosPorTurno(inicio: Date, final: Date) {
    const turnos = [
        {nome: 'Manhã', inicio: '06:00:00', fim: '11:59:59'},
        {nome: 'Tarde', inicio: '12:00:00', fim: '17:59:59'},
        {nome: 'Noite', inicio: '18:00:00', fim: '23:59:59'},
        {nome: 'Madrugada', inicio: '00:00:00', fim: '05:59:59'}
    ]
    return Promise.all(turnos.map(async turno => {
        return {
            turno: turno.nome,
            numeroChamados: await chamadoRepository.createQueryBuilder('chamado')
                .where('chamado.inicio BETWEEN :inicio AND :final', {inicio: inicio, final: final})
                .andWhere(`TIME(chamado.inicio) BETWEEN TIME(:turnoInicio) AND TIME(:turnoFim)`,
                    {turnoInicio: turno.inicio, turnoFim: turno.fim})
                .getCount()
        }
    }))
}

/*
{
    "horas": 83,
    "minutos": 42
} */
export async function tempoMedioTotal(inicio: Date, final: Date) {
    const media = await chamadoRepository
        .createQueryBuilder('chamado')
        .select('AVG(TIMESTAMPDIFF(MINUTE, chamado.inicio, chamado.final)) AS media')
        .where('chamado.inicio BETWEEN :inicio AND :final', {inicio: inicio, final: final})
        .andWhere('chamado.final IS NOT NULL')        
        .getRawOne()

    const mediaMinutos = parseInt(media.media)
    const horas = Math.floor(mediaMinutos/60)
    return { horas: horas, minutos: mediaMinutos%60 }
}

let tempoMedio = async (where: string, id: number, inicio: Date, final: Date) => {
    const media = await chamadoRepository
        .createQueryBuilder('chamado')
        .select('AVG(TIMESTAMPDIFF(MINUTE, chamado.inicio, chamado.final)) AS media')
        .where('chamado.inicio BETWEEN :inicio AND :final', {inicio: inicio, final: final})
        .andWhere('chamado.final IS NOT NULL')   
        .andWhere(where, {id: id})     
        .getRawOne()

    const mediaMinutos = parseInt(media.media)
    const horas = Math.floor(mediaMinutos/60)
    return { horas: horas, minutos: mediaMinutos%60 }
}