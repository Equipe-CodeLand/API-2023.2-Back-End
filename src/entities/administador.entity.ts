import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import Usuario from "./usuario.entity"

@Entity({name: 'administrador'})
export default class Administrador {

    @PrimaryGeneratedColumn({name:'adm_id'})
    public id: number

    @OneToOne(() => Usuario)
    @JoinColumn({name: 'user_id'})
    public usuario: Usuario

    constructor(usuario: Usuario) {
        this.usuario = usuario
    }
}