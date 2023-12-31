import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Problema from "./problema.entity";

@Entity({name: 'solucao'})
export default class Solucao {

    @PrimaryGeneratedColumn({name: 'sol_id'})
    public id: number

    @Column({name: 'sol_desc', length: 500})
    public desc: string

    @ManyToOne(() => Problema, (problema) => problema.solucao, {onDelete: "CASCADE"})
    @JoinColumn({name: 'pro_id'})
    public problema: Problema

    constructor(desc: string, problema: Problema) {
        this.desc = desc
        this.problema = problema
    }
}