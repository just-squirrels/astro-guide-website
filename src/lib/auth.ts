import type { AstroGlobal, APIContext } from "astro";
import type { PostType } from "./posts";

type Context = AstroGlobal | APIContext; 

export function canAdmin(ctx: Readonly<Context>) {
    return !!ctx.locals.admin;
}

export function canMod(ctx: Readonly<Context>) {
    return !!ctx.locals.mod || !!ctx.locals.admin;
}

export function canPost(type: PostType, ctx: Readonly<Context>) {
    // For now everyone can post any time, just make sure they're logged in
    return !!ctx.locals.alias;
}