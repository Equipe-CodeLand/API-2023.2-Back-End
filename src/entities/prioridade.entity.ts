import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Chamado from "./chamado.entity";

@Entity({name: 'prioridade'})
export default class Prioridade {
    static findOne(arg0: number) {
        throw new Error("Method not implemented.");
    }

    @PrimaryGeneratedColumn({name: 'pri_id'})
    public id: number

    @Column({name: 'pri_nome', length: 20})
    public nome: string

    @OneToMany(() => Chamado, (chamado) => chamado.status)
    public chamados: Chamado[]

    constructor(nome: string) {
        this.nome = nome
    }
}