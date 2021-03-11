import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import User from './User';

@Entity()
export default class Session extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public sessionId: string;

    @Column({
        type: 'datetime',
    })
    public startDate: Date = new Date(Date.now());

    @ManyToOne(type => User, user => user.sessions, {
        eager: true
    })
    public user: User;
}
