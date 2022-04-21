import {Game} from "../entity/Game";
import V2RuntimeToolInfo from "./V2RuntimeToolInfo";

export default class V2GameLaunchConfig {
    public gameName: string;
    public obfuscationRegex: string;
    public assemblyGenerationTools: V2RuntimeToolInfo[];

    public static build(game: Game, mlVersion: string): V2GameLaunchConfig | null {
        const matchingConfig = game.resolveRuntimeConfigurationForVersion(mlVersion);

        if(!matchingConfig)
            return null;

        const v2GameLaunchConfig = new V2GameLaunchConfig();
        v2GameLaunchConfig.gameName = game.gameName;
        v2GameLaunchConfig.obfuscationRegex = game.obfuscationRegex;
        v2GameLaunchConfig.assemblyGenerationTools = matchingConfig.toolVersions.map(V2RuntimeToolInfo.fromToolVersion);
        return v2GameLaunchConfig;
    }
}