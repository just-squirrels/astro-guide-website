import { chain, canPost, csrf } from "@/lib/middleware";
import type { APIRoute } from "astro";

export const post: APIRoute = chain(canPost("article"), csrf, async (ctx) => {
    const formData = await ctx.request.formData();
    const title = formData.get("title")?.valueOf();
    const summary = formData.get("summary")?.valueOf();
    const body = formData.get("body")?.valueOf();
    const tags = formData.get("tags")?.valueOf();

    // TODO: sanitize and validate inputs
    console.log({title, summary, body, tags});

    return ctx.redirect("/articles");
});
