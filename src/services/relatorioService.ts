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

    let dados = temas.map(async (tema) => {
        return {
            tema: tema,
            numeroChamados: await chamadoRepository.count({
                where: {
                    tema: {id: tema.id},
                    inicio: Between(inicio, final)
                }
            })
        }
    })

    return Promise.all(dados)
}

// mesma coisa mas muda de tema para prioridade
export async function chamadosPorPrioridade(inicio: Date, final: Date) {
    const prioridades = await prioridadeRepository.find()

    let dados = prioridades.map(async (pri) => {
        return {
            prioridade: pri,
            numeroChamados: await chamadoRepository.count({
                where: {
                    prioridade: {id: pri.id},
                    inicio: Between(inicio, final)
                }
            })
        }
    })

    return Promise.all(dados)
}