import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import Session from './Session';

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public username: string;

    @Column()
    public hash: string;

    @Column()
    public privilegeLevel: "admin" | "moderator" | "editor";

    @OneToMany(type => Session, session => session.user)
    public sessions: Session[];
}
