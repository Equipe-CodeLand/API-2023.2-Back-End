/* Criação das rotas no back aqui (cada coisa do back terá um arquivo com rota separadamente, aqui será para definir as rotas gerais,
 ou seja, mostrar todas as rotas) */

import { Router, Request, Response } from 'express';
import { obterChamados } from '../controllers/chamadosAten';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const chamados = await obterChamados();
        console.log("Chamados:");
        console.log(chamados);
        res.send('Chamados exibidos no console. Verifique o terminal do servidor.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter chamados.');
    }
});

export default router;
