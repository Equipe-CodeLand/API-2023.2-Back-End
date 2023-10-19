import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Cliente from "./cliente.entity";
import Status from "./status.entity";
import Atendente from "./atendente.entity";
import Mensagem from "./mensagem.entity";

@Entity({name: 'chamada'})
export default class Chamado {
    
    @PrimaryGeneratedColumn({name: 'cha_id'})
    public id: number

    @Column({name: 'cha_tema', length: 30})
    public tema: string

    @Column({name: 'cha_desc', length: 255})
    public desc: string

    @CreateDateColumn({name: 'cha_inicio'})
    public inicio: Date

    @Column({name: 'cha_final', nullable: true})
    public final: Date

    @ManyToOne(() => Cliente, (cliente) => cliente.chamados)
    @JoinColumn({name: 'cli_id'})
    public cliente: Cliente

    @ManyToOne(() => Status, (status) => status.chamados)
    @JoinColumn({name: 'sta_id'})
    public status: Status

    @ManyToOne(() => Atendente, (atendente) => atendente.chamados)
    @JoinColumn({name: 'ate_id'})
    public atendente: Atendente

    @OneToMany(() => Mensagem, (mensagem) => mensagem.chamado)
    public mensagens: Mensagem[];

    constructor(tema: string, desc: string, cliente: Cliente, status: Status) {
        this.tema = tema
        this.desc = desc
        this.cliente = cliente
        this.status = status
    }
}