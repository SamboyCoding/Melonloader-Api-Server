import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn} from 'typeorm';
import axios from 'axios';
import hasha from 'hasha';
import RuntimeConfiguration from "./RuntimeConfiguration";

// noinspection JSUnusedLocalSymbols
@Entity()
export class Game extends BaseEntity {

    @PrimaryColumn()
    public gameSlug!: string;

    @Column()
    public gameName!: string;

    @Column({
        nullable: true,
    })
    public mappingUrl?: string;

    @Column({
        nullable: true
    })
    public mappingFileSHA512?: string;

    @Column({
        nullable: true,
    })
    public forceCpp2IlVersion?: string;

    @Column({
        nullable: true,
    })
    public forceUnhollowerVersion?: string;

    @Column({
        nullable: true
    })
    public obfuscationRegex?: string;

    @ManyToMany(type => RuntimeConfiguration, runtimeConfiguration => runtimeConfiguration.games, {eager: true})
    public runtimeConfigurations!: RuntimeConfiguration[];

    public async refreshHash() {
        if(this.mappingUrl === null) return;

        console.log(`[Game] Refreshing mapping file SHA512 from ${this.mappingUrl}...`);

        try {
            const res = await axios.get(this.mappingUrl, {  responseType: 'arraybuffer' });

            this.mappingFileSHA512 = await hasha.async(res.data, {algorithm: 'sha512'});
            await this.save();

            console.log(`[Game] Saved SHA512: ${this.mappingFileSHA512}`);
        } catch(e) {
            console.error("[Game] Failed to refresh mapping hash: " + e.message);
        }
    }
}
