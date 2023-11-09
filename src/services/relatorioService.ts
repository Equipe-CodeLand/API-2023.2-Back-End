import { Between } from "typeorm";
import { AppDataSource } from "../config/data-source";
import Chamado from "../entities/chamado.entity";
import Tema from "../entities/tema.entity";
import Prioridade from "../entities/prioridade.entity";

const chamadoRepository = AppDataSource.getRepository(Chamado)
const temaRepository = AppDataSource.getRepository(Tema)
const prioridadeRepository = AppDataSource.getRepository(Prioridade)

/*
[
    {
        "tema": {
            "nome": "Acesso a internet",
            "id": 1
        },
        "numeroChamados": 1
    },
    {
        "tema": {
            "nome": "Modem",
            "id": 2
        },
        "numeroChamados": 1
    },
    {
        "tema": {
            "nome": "Outros",
            "id": 3
        },
        "numeroChamados": 0
    },
    {
        "tema": {
            "nome": "Velocidade da internet",
            "id": 4
        },
        "numeroChamados": 1
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
            })
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
        "numeroChamados": 2
    },
    {
        "prioridade": {
            "nome": "Média",
            "id": 2
        },
        "numeroChamados": 1
    },
    {
        "prioridade": {
            "nome": "Baixa",
            "id": 3
        },
        "numeroChamados": 1
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
            })
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