import type { APIContext, APIRoute } from "astro";
import type { PostType } from "./posts";
import { checkSignedToken } from "./utils";
import * as auth from "./auth";

const forbidden = (statusText?: string) => new Response(null, { status: 403, statusText });
const badRequest = (statusText?: string) => new Response(null, { status: 400, statusText });

type APIResponse = ReturnType<APIRoute>;
export type Middleware = (ctx: APIContext, next: () => APIResponse) => APIResponse;

export const canAdmin: Middleware = function(ctx, next) {
    return auth.canAdmin(ctx) ? next() : forbidden("Cannot administrate");
}

export const canMod: Middleware = function(ctx, next) {
    return auth.canMod(ctx) ? next() : forbidden("Cannot moderate");
}

export const canPost: (type: PostType) => Middleware = (type) => function(ctx, next) {
    return auth.canPost(type, ctx) ? next() : forbidden(`Cannot post ${type}`);
}

export const hasFormData: Middleware = async function(ctx, next) {
    return await ctx.request.formData().catch(() => false) ? next() : badRequest("Missing form data");
}

export const csrf: Middleware = async function(ctx, next) {
    return hasFormData(ctx, async () => {
        const sigtoken = (await ctx.request.formData()).get("csrf")?.valueOf();
        return typeof(sigtoken) === "string" && checkSignedToken(ctx.locals.secret, sigtoken)
            ? next() : forbidden("Missing or invalid CSRF");
    });
}

export function chain(...parts: Middleware[]) {
    return parts.reduceRight<APIRoute>(
        (rest, part) => (ctx) => part(ctx, () => rest(ctx)),
        async () => {
            console.log("unterminated chain");
            return new Response(null, { status: 500 });
        });
}
