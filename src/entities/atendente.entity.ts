import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Usuario from "./usuario.entity";
import Chamado from "./chamado.entity";

@Entity({name: 'atendente'})
export default class Atendente {

    @PrimaryGeneratedColumn({name:'ate_id'})
    public id: number

    @Column({name:'ate_turno', length: 15})
    public turno: string

    @OneToOne(() => Usuario, {eager: true})
    @JoinColumn({name: 'user_id'})
    public usuario: Usuario

    @OneToMany(() => Chamado, (chamado) => chamado.atendente)
    public chamados: Chamado[]

    constructor(turno: string, usuario: Usuario) {
        this.turno = turno
        this.usuario = usuario
    }

}