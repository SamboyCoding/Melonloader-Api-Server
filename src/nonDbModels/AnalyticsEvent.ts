import moment, {Moment} from 'moment';

export default class AnalyticsEvent {
    public when: Moment;
    public game: string;
    public processed: boolean;

    constructor(game: string, processed: boolean) {
        this.when = moment();
        this.game = game;
        this.processed = processed;
    }
}
