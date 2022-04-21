import Session from '../../entity/Session';
import {Game} from "../../entity/Game";

declare global {
    namespace Express {
        export interface Request {
            session: Session;
            game: Game;
        }
    }
}

export {};
