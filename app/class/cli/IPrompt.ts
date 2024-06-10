export interface IPrompt {
    shards(): string[];
    commands(): string[];
    args(): string[];
}