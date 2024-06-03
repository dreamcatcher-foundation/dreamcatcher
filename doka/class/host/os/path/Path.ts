import * as TsResult from "ts-results";
import * as FileSystem from "fs";

export class Path {
    public constructor(protected _inner: string) {}

    public toString(): string {
        return this._inner;
    }

    public exists(): TsResult.Result<boolean, unknown> {
        try {
            return new TsResult.Ok<boolean>(FileSystem.existsSync(this.toString()));
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }
 
    public isFile(): TsResult.Result<boolean, unknown> {
        try {
            if (!this.exists().unwrapOr(false)) {
                return new TsResult.Err<string>("Path::FileNotFound");
            }
            return new TsResult.Ok<boolean>(FileSystem.statSync(this.toString()).isFile());
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    public isDirectory(): TsResult.Result<boolean, unknown> {
        try {
            if (!this.exists().unwrapOr(false)) {
                return new TsResult.Err<string>("Path::FileNotFound");
            }
            return new TsResult.Ok<boolean>(FileSystem.statSync(this.toString()).isFile());
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }
}