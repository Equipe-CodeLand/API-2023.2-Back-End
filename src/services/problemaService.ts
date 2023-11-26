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

export async function enviarProblema(desc: string, tema_id: number, solucaoo: string) {
    try {
        const tema = await temaRepository.findOneBy({ id: tema_id });

        // Criação da solução
        const solucao = solucaoRepository.create({
            desc: solucaoo,
        });

        const createSolution = await solucaoRepository.save(solucao);

        // Criação do problema e associação da solução a ele
        const problema = problemaRepository.create({
            desc: desc,
            tema: tema,
            solucao: createSolution // Associa a solução criada ao problema
        });

        const createProblem = await problemaRepository.save(problema);

        // Associação da solução ao problema
        createSolution.problema = createProblem;
        await solucaoRepository.save(createSolution);

        return { createProblem, createSolution };
    } catch (error) {
        return error;
    }
}

export async function buscarProblemas() {
    try {
        const problemas = await problemaRepository.find({
            select: {
                "id": true,
                "desc": true,
                "tema": {
                    "nome": true
                },
                "solucao":{
                    "desc": true
                }
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

export async function atualizarProblemas(id: number, data: any) {
    try {
        const fetch = await problemaRepository.findOneBy({
            id: id
        })

        const tema = await temaRepository.findOneBy({
            id: data.tema_id ||fetch.tema.id
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

/*export async function atualizarSolucoes(id: number, data: any) {
    try {
        const fetch = await solucaoRepository.findOneBy({
            problema: {
                id: id
            }
        })

        const solucao = await solucaoRepository.update(Number(data.id), {
            desc: data.desc || fetch.desc,
        })

        return { solucao }
    } catch (error) {
        return error
    }
}*/

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