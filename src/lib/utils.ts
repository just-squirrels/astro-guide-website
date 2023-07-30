import { randomBytes, createHmac } from "node:crypto";

function encode(buffer: Buffer, alpha: string) {
    let encoded = "";
    let num = 0;
    for (const b of buffer.values()) {
        num = num << 8 + b;
        while (num >= alpha.length) {
            encoded += alpha[num % alpha.length];
            num = Math.floor(num / alpha.length);
        }
    }
    return encoded + alpha[num];
}

export function encodeBase58(buffer: Buffer) {
    const base58 = "123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz" as const;
    return encode(buffer, base58);
}

export function addHours(hours: number, date?: Date) {
    const d = new Date(date ?? Date.now());
    d.setHours(d.getHours() + hours);
    return d;
}

export function genTokenB58(bytes: number) {
    return encodeBase58(randomBytes(bytes));
}

export function genToken(bytes: number) {
    return randomBytes(bytes).toString("base64url");
}

export function genSig(key: string, source: string) {
    return createHmac("sha256", key).update(source).digest("base64url");
}

export function genSignedToken(key: string, bytes: number) {
    const token = genToken(bytes);
    const sig = genSig(key, token);
    return [token, sig].join(".");
}

export function checkSignedToken(key: string, sigtoken: string) {
    const [token, sig] = sigtoken.split(".");
    return sig === genSig(key, token);
}