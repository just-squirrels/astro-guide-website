import { defineMiddleware } from "astro/middleware";
import { getSession } from "@/lib/sessions";

export const onRequest = defineMiddleware(async (ctx, next) => {
    const sid = ctx.cookies.get("sid").value;
    const session = await getSession(sid);
    if (session) {
        Object.assign(ctx.locals, session);
    }
    return next();
});
