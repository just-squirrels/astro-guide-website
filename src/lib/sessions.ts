import { addHours, genToken } from "./utils";

export type SessionParams = {
    alias?: string;
    admin?: boolean;
    mod?: boolean;
}

export type Session = SessionParams & {
    sid: string;
    secret: string;
    expiresAt: Date;
    createdAt: Date;
}

// TODO: Dynamo, baby, and some cache!
const sessions = new Map<string, Session>();

export async function createSession(params: SessionParams = {}) {
    const session: Session = {
        ...params,
        sid: genToken(40),
        secret: genToken(40),
        createdAt: new Date(),
        expiresAt: addHours(24)
    };

    sessions.set(session.sid, session);

    return session;
}

export async function updateSession(sid: string, params: SessionParams) {
    const session = sessions.get(sid);

    if (!session) return;

    if (session.expiresAt < new Date()) {
        sessions.delete(sid);
        return;
    }
    
    Object.assign(session, params);
    sessions.set(sid, session);

    return session;
}

export async function deleteSession(sid: string) {
    sessions.delete(sid);
}

export async function getSession(sid?: string) {
    if (!sid) return;
    return sessions.get(sid);
}