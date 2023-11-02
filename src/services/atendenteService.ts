import { AppDataSource } from "../config/data-source";
import Atendente from "../entities/atendente.entity";
import Usuario from "../entities/usuario.entity";
import { cadastrarUsuario } from "./usuarioService";

const atendenteRepository = AppDataSource.getRepository(Atendente)
const usuarioRepository = AppDataSource.getRepository(Usuario)

export async function buscarTodosAtendentes() {
    return atendenteRepository.find()
}

export async function buscarAtendente(id: number) {
    return atendenteRepository.findOneBy({id: id})
}


/*export async function buscarAtendentePorId(atendenteId: number) {
    try {
        const atendente = await atendenteRepository.findOneBy({id: atendenteId});
        return atendente;
    } catch (error) {
        console.error('Erro ao buscar o atendente:', error);
        throw new Error('Atendente não encontrado');
    }
}*/

export async function criarAtendente(turno: string, usuario: Usuario) {
    try {
        // Primeiro, salve o usuário no banco de dados
        const usuarioCriado = await usuarioRepository.save(usuario);

        // Em seguida, crie o atendente com o usuário criado
        const atendente = new Atendente(turno, usuarioCriado);

        // Finalmente, salve o atendente no banco de dados
        const atendenteCriado = await atendenteRepository.save(atendente);

        return atendenteCriado;
    } catch (error) {
        console.error('Erro ao criar o atendente:', error);
        throw new Error('Erro ao criar o atendente');
    }
}