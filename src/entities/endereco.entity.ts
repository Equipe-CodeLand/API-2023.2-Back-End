import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'endereco'})
export default class Endereco {

    @PrimaryGeneratedColumn({name: 'end_id'})
    public id: number

    @Column({name: 'end_cep', length: 9})
    public cep: string

    @Column({name: 'end_bairro', length: 30})
    public bairro: string

    @Column({name: 'end_rua', length: 30})
    public rua: string

    @Column({name: 'end_cidade', length: 80})
    public cidade: string

    @Column({name: 'end_estado', length: 2})
    public estado: string

    constructor(cep: string, bairro: string, rua: string, cidade: string, estado: string) {
        this.bairro = bairro
        this.cep = cep
        this.rua = rua
        this.cidade = cidade
        this.estado = estado
    }

}