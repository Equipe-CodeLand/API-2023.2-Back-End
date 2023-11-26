import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Problema from "./problema.entity";

@Entity({name: 'solucao'})
export default class Solucao {

    @PrimaryGeneratedColumn({name: 'sol_id'})
    public id: number

    @Column({name: 'sol_desc', length: 500})
    public desc: string

    @OneToOne(() => Problema, (problema) => problema.solucao)
    @JoinColumn({name: 'pro_id'})
    public problema: Problema

    constructor(desc: string, problema: Problema) {
        this.desc = desc
        this.problema = problema
    }
}