export type Tag = {
    id: string;
    alias: string;
    name: string;
    alts: string[]; // synonyms, etc, might not include name or alias
    desc: string;
}

// Dynamo and cache, dynamo and cache..
const tags: Tag[] = [
    { id: "1", alias: "s3", name: "Amazon S3", alts: [], desc: "Amazon's Simple Storage Service" },
    { id: "2", alias: "dynamodb", name: "AWS DynamoDB", alts: [], desc: "Fast NoSQL Key-Value Database by AWS" },
    { id: "3", alias: "ec2", name: "Amazon EC2", alts: [], desc: "Amazon's Elastic Cloud Compute" },
    { id: "4", alias: "lambda", name: "AWS Lambda", alts: [], desc: "Serverless Functions by AWS" },
];

const tagsById = new Map(tags.map(tag => [tag.id, tag]));
const tagsByAlias = new Map(tags.map(tag => [tag.alias, tag]));

/** Get a tag by its ID (or alias) */
export async function getTag(tagId: string) {
    return tagsById.get(tagId) ?? tagsByAlias.get(tagId);
}
