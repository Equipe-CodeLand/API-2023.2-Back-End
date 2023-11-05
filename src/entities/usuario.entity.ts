import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import Mensagem from "./mensagem.entity"

@Entity({name: 'usuario'})
export default class Usuario {

    @PrimaryGeneratedColumn({ name: 'user_id' })
    public id: number

    @Column({ name: 'user_nome', length: 50, nullable: false })
    public nome: string
    
    @Column({ name: 'user_sobrenome', length: 50, nullable: false })
    public sobrenome: string

    @Column({ name: 'user_cpf', length: 15, nullable: false , select: false})
    public cpf: string

    @Column({ name: 'user_email', length: 50, nullable: false })
    public email: string

    @Column({ name: 'user_telefone', length: 15, nullable: false })
    public telefone: string

    @Column({ name: 'user_senha', length: 8, nullable: true, select: true })
    public senha: string

    @OneToMany(() => Mensagem, (mensagem) => mensagem.usuario)
    public mensagens: Mensagem[]

    constructor(nome: string, sobrenome: string, cpf: string, email: string, telefone: string, senha: string) {
        this.nome = nome
        this.sobrenome = sobrenome
        this.cpf = cpf
        this.email = email
        this.telefone = telefone
        this.senha = senha
    }
}