import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Cliente from "./cliente.entity";
import Status from "./status.entity";
import Atendente from "./atendente.entity";
import Mensagem from "./mensagem.entity";
import Prioridade from "./prioridade.entity";
import Tema from "./tema.entity";

@Entity({name: 'chamada'})
export default class Chamado {
    
    @PrimaryGeneratedColumn({name: 'cha_id'})
    public id: number

    @ManyToOne(() => Tema, (tema) => tema.chamados)
    @JoinColumn({name: 'tema_id'})
    public tema: Tema

    @Column({name: 'cha_desc', length: 255})
    public desc: string

    @CreateDateColumn({name: 'cha_inicio'})
    public inicio: Date

    @Column({name: 'cha_final', nullable: true})
    public final: Date

    @ManyToOne(() => Cliente, (cliente) => cliente.chamados, {eager:true})
    @JoinColumn({name: 'cli_id'})
    public cliente: Cliente

    @ManyToOne(() => Status, (status) => status.chamados, {eager:true})
    @JoinColumn({name: 'sta_id'})
    public status: Status

    @ManyToOne(() => Atendente, (atendente) => atendente.chamados, {eager:true})
    @JoinColumn({name: 'ate_id'})
    public atendente: Atendente

    @ManyToOne(()=> Prioridade, (prioridade) => prioridade.chamados)
    @JoinColumn({name: 'pri_id'})
    public prioridade: Prioridade

    @OneToMany(() => Mensagem, (mensagem) => mensagem.chamado)
    public mensagens: Mensagem[];

    constructor(tema: Tema, desc: string, cliente: Cliente, status: Status, prioridade: Prioridade) {
        this.tema = tema
        this.desc = desc
        this.cliente = cliente
        this.status = status
        this.prioridade = prioridade
    }
}