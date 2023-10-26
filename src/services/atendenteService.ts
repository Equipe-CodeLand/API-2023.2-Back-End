import { AppDataSource } from "../config/data-source";
import Atendente from "../entities/atendente.entity";
import { atrubuirAtendente } from "./chamadoService";

const atendenteRepository = AppDataSource.getRepository(Atendente);

//function para buscar os atendentes
export async function buscarAtendente(idAtendente: number) {
    return atendenteRepository.findOneBy({id: idAtendente})
}

export async function buscarAtendentes(){
    return atendenteRepository.find()
}
