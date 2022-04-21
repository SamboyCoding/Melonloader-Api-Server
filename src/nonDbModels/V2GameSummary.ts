import {Game} from "../entity/Game";

export default class V2GameSummary {
    public slug: string;
    public name: string;
    public runtimeConfigNames: string[];

    public static from(game: Game): V2GameSummary {
        const summary = new V2GameSummary();
        summary.slug = game.gameSlug;
        summary.name = game.gameName;
        summary.runtimeConfigNames = game.runtimeConfigurations.map(rc => rc.name);
        return summary;
    }
}