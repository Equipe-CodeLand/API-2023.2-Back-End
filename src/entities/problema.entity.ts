import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Tema from "./tema.entity";
import Solucao from "./solucao.entity";

@Entity({name: 'problema'})
export default class Problema {

    @PrimaryGeneratedColumn({name: 'pro_id'})
    public id: number

    @Column({name: 'pro_desc', length: 255})
    public desc: string

    @ManyToOne(() => Tema, (tema) => tema.problemas)
    @JoinColumn({name: 'tema_id'})
    public tema: Tema

    @OneToMany(() => Solucao, (solucao) => solucao.problema)
    public solucao: Solucao[];

    constructor(desc: string, tema: Tema) {
        this.desc = desc
        this.tema = tema
    }
}