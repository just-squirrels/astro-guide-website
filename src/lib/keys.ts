import { genToken } from "./utils";

/** Keys are (short lived?) are secrets with IDs;
    they are stored under their key ID (kid) such
    that the ID may be transmitted in clear and
    the key then used for signing. Think JWTs. */

// TODO: Dynamo and cache
const keys = new Map<string, string>();

export async function createKey() {
    const kid = genToken(16);
    const key = genToken(40);

    // Eventually keys need a expiration mechanism
    // so they get renewed every few days or hours
    keys.set(kid, key);

    return { kid, key };
}

export async function getKey(kid: string) {
    return keys.get(kid);
}

export async function getLatest() {
    // Eventually we'll use the most recent key, or
    // the key with the furthest expiration, but for
    // now just return whatever
    if (keys.size >  0) {
        const [kid, key] = [...keys.entries()][keys.size - 1];
        return { kid, key };
    }

    return createKey();
}