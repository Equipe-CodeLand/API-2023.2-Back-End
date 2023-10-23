import {ViewEntity, ViewColumn} from "typeorm";

@ViewEntity({
    expression: `
        SELECT 
            chamado.id,
            usuario.nome AS cliente_nome,
            chamado.tema,
            status.nome AS status,
            chamado.inicio,
            chamado.final,
            chamado.desc,
            mensagem.texto,
            mensagem.tipoUsuario,
            mensagem.horaEnvio
        FROM 
            chamado
        INNER JOIN 
            cliente ON chamado.cli_id = cliente.id
        INNER JOIN 
            usuario ON cliente.user_id = usuario.id
        INNER JOIN 
            status ON chamado.sta_id = status.id
        INNER JOIN 
            mensagem ON chamado.id = mensagem.cha_id;
    `
})
export class ChamadosInformacoes {

    @ViewColumn()
    id: number;

    @ViewColumn()
    cliente_nome: string;

    @ViewColumn()
    tema: string;

    @ViewColumn()
    status: string;

    @ViewColumn()
    inicio: Date;

    @ViewColumn()
    final: Date;

    @ViewColumn()
    desc: string;

    @ViewColumn()
    texto: string;

    @ViewColumn()
    tipoUsuario: string;

    @ViewColumn()
    horaEnvio: Date;
}
