import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Chamado from "./chamado.entity";
import Problema from "./problema.entity";

@Entity({name: 'tema'})
export default class Tema {
    static findOne(arg0: number) {
        throw new Error("Method not implemented.");
    }

    @PrimaryGeneratedColumn({name: 'tema_id'})
    public id: number

    @Column({name: 'tema_nome', length: 40})
    public nome: string

    @OneToMany(() => Chamado, (chamado) => chamado.tema)
    public chamados: Chamado[]

    @OneToMany(() => Problema, (problema) => problema.tema)
    public problemas: Problema[]
    
    constructor(nome: string) {
        this.nome = nome
    }
}