import type { APIRoute } from "astro";
import { deleteSession } from "@/lib/sessions";

export const get: APIRoute = async (ctx) => {
    const sid = ctx.cookies.get("sid").value;
    if (sid) {
        ctx.cookies.delete("sid");
        await deleteSession(sid);
    }
    return ctx.redirect("/");
};
