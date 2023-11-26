import { AppDataSource } from '../config/data-source';
import ProblemaEntity from '../entities/problema.entity';
import SolucaoEntity from '../entities/solucao.entity';
import TemaEntity from '../entities/tema.entity';

const problemaRepository = AppDataSource.getRepository(ProblemaEntity);
const temaRepository = AppDataSource.getRepository(TemaEntity);
const solucaoRepository = AppDataSource.getRepository(SolucaoEntity);

interface Problema {
    desc: string,
    tema_id: number,
    solucao: Solucao[]
}

interface Solucao {
    desc: string,
}

export async function enviarProblema(desc: string, tema_id: number, solucao: []) {
    try {
        const tema = await temaRepository.findOneBy({
            id: tema_id
        })

        const problema = await problemaRepository.create({
            desc: desc,
            tema: tema
        })

        const createProblem = await problemaRepository.save(problema)

        const createSolution = await Promise.all(solucao.map(async (solu) => {
            const solucoes = solucaoRepository.create({
                desc: solu,
                problema: createProblem,
            });

            return await solucaoRepository.save(solucoes);
        }));

        return { createProblem, createSolution }
    } catch (error) {
        return error
    }
}

export async function enviarSolucao(desc: string, id: number) {
    const fetch = await problemaRepository.findOneBy({
        id: id
    })

    const create = await solucaoRepository.create({
        desc: desc,
        problema: fetch
    })

    await solucaoRepository.save(create)

    return { create }
}

export async function buscarProblemas() {
    try {
        const problemas = await problemaRepository.find({
            select: {
                "id": true,
                "desc": true,
            },
            relations: {
                tema: true,
                solucao: true
            }
        })

        return { problemas }
    } catch (error) {
        return error
    }
}

export async function buscarProblema(id: number) {
    try {
        const problema = await problemaRepository.findOne({
            where: {
                id: id,
            },
            relations: ["tema"],
        })

        return { problema }
    } catch (error) {
        return error
    }
}


export async function atualizarProblemas(id: number, data: any) {
    try {
        const fetch = await problemaRepository.findOneBy({
            id: id
        })

        const tema = await temaRepository.findOneBy({
            id: data.tema_id || fetch.tema.id
        })

        const problema = await problemaRepository.update(Number(id), {
            desc: data.desc || fetch.desc,
            tema: tema
        });

        return { problema }
    } catch (error) {
        return error
    }
}

export async function atualizarSolucoes(id: number, data: any) {
    try {
        const fetch = await solucaoRepository.findOneBy({
            id: id
        })

        const solucao = await solucaoRepository.update(id, {
            desc: data.desc || fetch.desc,
        })

        return { solucao }
    } catch (error) {
        return error
    }
}

export async function deletarProblemas(id: number) {
    try {
        const problema = await problemaRepository.delete({
            id: id
        })

        return { problema }
    } catch (error) {
        return error
    }
}

export async function deletarSolucoes(id: number) {
    try {
        const solucao = await solucaoRepository.delete({
            id: id
        })

        return { solucao }
    } catch (error) {
        return error
    }
}