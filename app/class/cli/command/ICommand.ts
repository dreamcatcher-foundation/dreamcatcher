export interface ICommand {
    requiredCommands(): string[];
    run(args: unknown[]): Promise<void>;
}