import {BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Game} from "./Game";
import ToolVersion from "./ToolVersion";

// noinspection JSUnusedLocalSymbols
@Entity()
export default class RuntimeConfiguration extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public uuid: string;

    @Column()
    public name: string;

    @Column()
    public minMlVersion: string;

    @Column()
    public defaultForThisMlVersion: boolean;

    @ManyToMany(type => Game, game => game.runtimeConfigurations)
    public games: Game[];

    @OneToMany(type => ToolVersion, toolVersion => toolVersion.runtimeConfiguration, {eager: true})
    public toolVersions: ToolVersion[];
}