import Session from '../../entity/Session';

declare global {
    namespace Express {
        export interface Request {
            session: Session;
        }
    }
}

export {};
