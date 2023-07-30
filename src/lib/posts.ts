import { genTokenB58 } from "./utils";

export type PostType = "question" | "answer" | "comment" | "article";
export type PostState = "draft" | "published" | "archived";

export type PostParams = {
    authorId: string;
    type: PostType;
    state: PostState;
    collectionId?: string;
    parentId?: string;
    title?: string;
    body?: string;
    summary?: string;
    tags?: string[];
}

export type Post = PostParams & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// TODO: Dynamo, baby, and some cache!
const posts = new Map<string, Post>();

export async function createPost(params: PostParams) {
    const post: Post = {
        ...params,
        id: genTokenB58(16),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    posts.set(post.id, post);

    return post;
}

export async function updatePost(id: string, params: Partial<PostParams>) {
    const post = posts.get(id);
    if (!post) return;

    Object.assign(post, params);
    post.updatedAt = new Date();

    posts.set(id, post);

    return post;
}

export async function getPost(id: string) {
    return posts.get(id);
}

// We need a variety of list options; this will eventually be a mix of
// Dynamo and OpenSearch queries once that's all in place.

export async function listByCollection(collectionId: string /* TODO: pagination */) {
    return [...posts.values()].filter(p => p.collectionId === collectionId);
}

export async function listByAuthor(authorId: string /* TODO: pagination */) {
    return [...posts.values()].filter(p => p.authorId === authorId);
}

export async function listByType(type: PostType /* TODO: pagination */) {
    return [...posts.values()].filter(p => p.type === type);
}

export async function listByState(state: PostState /* TODO: pagination */) {
    return [...posts.values()].filter(p => p.state === state);
}

export async function listByTag(tagId: string /* TODO: pagination */) {
    return [...posts.values()].filter(p => p.tags && p.tags.includes(tagId));
}