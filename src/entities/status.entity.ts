import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Chamado from "./chamado.entity";

@Entity({name: 'stats'})
export default class Status {

    @PrimaryGeneratedColumn({name: 'sta_id'})
    public id: number

    @Column({name: 'sta_nome', length: 20})
    public nome: string

    @OneToMany(() => Chamado, (chamado) => chamado.status)
    public chamados: Chamado[]
    
    constructor(nome: string) {
        this.nome = nome
    }
}