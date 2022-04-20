import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Tool from "./Tool";
import RuntimeConfiguration from "./RuntimeConfiguration";

// noinspection JSUnusedLocalSymbols
@Entity()
export default class ToolVersion extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public uuid: string;

    @Column()
    public version: string;

    @ManyToOne(type => Tool, tool => tool.versions, {eager: true})
    public tool: Tool;

    @ManyToOne(type => RuntimeConfiguration, runtimeConfiguration => runtimeConfiguration.toolVersions)
    public runtimeConfiguration: RuntimeConfiguration;
}