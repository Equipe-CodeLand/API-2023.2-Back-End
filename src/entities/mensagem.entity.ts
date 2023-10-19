import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Usuario from "./usuario.entity";
import Chamado from "./chamado.entity";

@Entity({name: 'mensagem'})
export default class Mensagem {

    @PrimaryGeneratedColumn({name: 'msg_id'})
    public id: number

    @Column({name: 'msg_texto', length: 255, nullable: false})
    public texto: string

    @ManyToOne(() => Chamado, (chamado) => chamado.mensagens)
    @JoinColumn({name: 'cha_id'})
    public chamado: Chamado

    @ManyToOne(() => Usuario, (usuario) => usuario.mensagens)
    @JoinColumn({name: 'user_id'})
    public usuario: Usuario

    @Column({name: 'msg_tipo_usuario'})
    public tipoUsuario: string 

    @CreateDateColumn({name: 'msg_hora_envio'})
    public horaEnvio: Date

    constructor(texto: string, chamado: Chamado, usuario: Usuario, tipoUsuario: string) {
        this.texto = texto
        this.chamado = chamado
        this.usuario = usuario
        this.tipoUsuario = tipoUsuario
    }

}