import {BaseEntity, Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import ToolVersion from "./ToolVersion";

// noinspection JSUnusedLocalSymbols
@Entity()
export default class Tool extends BaseEntity {
    public static LegacyCpp2Il: Tool;
    public static LegacyUnhollower: Tool;
    public static LegacyDeobfMap: Tool;

    @PrimaryColumn()
    public slug: string;

    @Column()
    public name: string;

    @Column({type: 'text'})
    public downloadUrlTemplate: string;

    @Column()
    public destinationPath: string;

    @Column()
    public compressionType: 'none' | 'gzip' | 'zip';

    @Column({nullable: true})
    public decompressDir?: string = null;

    @Column({nullable: true, type: 'text'})
    public commandLineTemplate?: string = null;

    @Column({nullable: true, type: 'text'})
    public environmentVariables?: string = null;

    @Column({nullable: true, type: 'text'})
    public outputPaths?: string = null;

    @Column({nullable: true})
    public nonZeroExitCodeBehavior: 'ignore' | 'fail' | null = null;

    @OneToMany(type => ToolVersion, toolVersion => toolVersion.tool)
    public versions: ToolVersion[];

    public static async InitLegacyTools(): Promise<void> {
        //Legacy tools are required for the v1 api.

        this.LegacyCpp2Il = await Tool.findOneBy({slug: 'cpp2il-legacy'});
        this.LegacyUnhollower = await Tool.findOneBy({slug: 'unhollower-legacy'});
        this.LegacyDeobfMap = await Tool.findOneBy({slug: 'deobf-map-legacy'});

        if(!this.LegacyCpp2Il) {
            this.LegacyCpp2Il = new Tool();
            this.LegacyCpp2Il.slug = 'cpp2il-legacy';
            this.LegacyCpp2Il.name = 'Cpp2Il';
            this.LegacyCpp2Il.downloadUrlTemplate = 'https://github.com/SamboyCoding/Cpp2IL/releases/download/${VERSION}/Cpp2IL-${VERSION}-Windows-Netframework472.zip';
            this.LegacyCpp2Il.destinationPath = 'Cpp2Il.zip';
            this.LegacyCpp2Il.compressionType = 'zip';
            this.LegacyCpp2Il.decompressDir = "Cpp2IL";
            this.LegacyCpp2Il.commandLineTemplate = 'Cpp2Il.exe --game-path ${GAME_PATH} --exe-name ${EXE_NAME} --skip-analysis --skip-metadata-txts --disable-registration-prompts';
            this.LegacyCpp2Il.environmentVariables = 'NO_COLOR=1';
            this.LegacyCpp2Il.outputPaths = 'DUMMY_DLL=cpp2il_out';
            this.LegacyCpp2Il.nonZeroExitCodeBehavior = 'fail';
            await this.LegacyCpp2Il.save();
        }

        if(!this.LegacyUnhollower) {
            this.LegacyUnhollower = new Tool();
            this.LegacyUnhollower.slug = 'unhollower-legacy';
            this.LegacyUnhollower.name = 'Il2CppAssemblyUnhollower';
            this.LegacyUnhollower.downloadUrlTemplate = 'https://github.com/knah/Il2CppAssemblyUnhollower/releases/download/v${VERSION}/Il2CppAssemblyUnhollower.${VERSION}.zip'
            this.LegacyUnhollower.destinationPath = 'Il2CppAssemblyUnhollower.zip';
            this.LegacyUnhollower.compressionType = 'zip';
            this.LegacyUnhollower.decompressDir = 'Il2CppAssemblyUnhollower';
            this.LegacyUnhollower.commandLineTemplate =
                'Il2CppAssemblyUnhollower.exe --input=${OUTPUTS.DUMMY_DLL} --output=Managed --mscorlib=${MONO_MSCORLIB} ' +
                '--unity=${UNITY_DEPENDENCIES} --gameassembly=${GAME_ASSEMBLY} ${RENAME_MAP_ARG} ${OBF_REGEX_ARG} ' +
                '--add-prefix-to=ICSharpCode --add-prefix-to=Newtonsoft --add-prefix-to=TinyJson --add-prefix-to=Valve.Newtonsoft';
            this.LegacyUnhollower.outputPaths = 'UNHOLLOWED_ASSEMBLIES=Managed';
            this.LegacyUnhollower.nonZeroExitCodeBehavior = 'fail';
            await this.LegacyUnhollower.save();
        }

        if(!this.LegacyDeobfMap) {
            this.LegacyDeobfMap = new Tool();
            this.LegacyDeobfMap.slug = 'deobf-map-legacy';
            this.LegacyDeobfMap.name = 'DeobfMap';

            //Version of a deobf map is relative to the LG deobf map repo.
            //E.g VRChat/1169.0.csv.gz
            this.LegacyDeobfMap.downloadUrlTemplate = 'https://github.com/LavaGang/Deobfuscation-Maps/raw/master/${VERSION}';
            this.LegacyDeobfMap.destinationPath = 'DeobfuscationMap.csv.gz';
            this.LegacyDeobfMap.compressionType = 'gzip';
            this.LegacyDeobfMap.decompressDir = '.';
            await this.LegacyDeobfMap.save();
        }
    }
}