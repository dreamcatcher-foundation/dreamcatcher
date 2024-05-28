import * as FileSystem from "fs";
import * as ErrorHandler from "ts-results";
import { Streamer } from "../core/Streamer.ts";

interface IDatabaseItem {}

interface IDatabase {
    save(item: IDatabaseItem): ErrorHandler.Result<void, unknown>;
    load(): ErrorHandler.Result<IDatabaseItem, unknown>;
}

class Database extends Streamer implements IDatabase {
    private readonly _path: string;

    public constructor() {
        super("database");
        this._path = "doka/storage/Storage.json";
    }

    public save(item: IDatabaseItem): ErrorHandler.Result<void, unknown> {
        try {
            return new ErrorHandler.Ok<void>(FileSystem.writeFileSync(this._path, JSON.stringify(item, null, 4)));
        }
        catch (error: unknown) {
            return new ErrorHandler.Err<unknown>(error);
        }
    }

    public load(): ErrorHandler.Result<IDatabaseItem, unknown> {
        try {
            return new ErrorHandler.Ok<IDatabaseItem>(JSON.parse(FileSystem.readFileSync(this._path, "utf8")));
        }
        catch (error: unknown) {
            return new ErrorHandler.Err<unknown>(error);
        }
    }
}

export { type IDatabaseItem };
export { Database };