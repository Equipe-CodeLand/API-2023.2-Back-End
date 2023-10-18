import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Usuario from "./usuario.entity";
import Chamado from "./chamado.entity";

@Entity({name: 'cliente'})
export default class Cliente {

    @PrimaryGeneratedColumn({name: 'cli_id'})
    public id: number

    @OneToOne(() => Usuario, {eager: true})
    @JoinColumn({name: 'user_id'})
    public usuario: Usuario

    @OneToMany(() => Chamado, (chamado) => chamado.cliente)
    public chamados: Chamado[];

    constructor(usuario: Usuario) {
        this.usuario = usuario
    }

}