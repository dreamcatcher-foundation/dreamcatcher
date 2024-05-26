import { Result } from "ts-results";
import { Ok } from "ts-results";
import { Err } from "ts-results";
import { existsSync } from "fs";
import { statSync } from "fs";

class Path {
    public constructor(private _string: string) {}

    public toString(): string {
        return this._string;
    }

    public exists(): Result<boolean, unknown> {
        try {
            return new Ok<boolean>(existsSync(this.toString()));
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }

    public isFile(): Result<boolean, unknown> {
        if (!this.exists().unwrapOr(false)) {
            return new Err<string>("Path: File not found.");
        }
        try {
            return new Ok<boolean>(statSync(this.toString()).isFile());
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }

    public isDirectory(): Result<boolean, unknown> {
        if (!this.exists().unwrapOr(false)) {
            return new Err<string>("Path: File not found.");
        }
        try {
            return new Ok<boolean>(statSync(this.toString()).isFile());
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }
}

export { Path };