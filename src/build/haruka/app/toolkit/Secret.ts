import { Option } from "@HarukaToolkitBundle";
import { Some } from "@HarukaToolkitBundle";
import { None } from "@HarukaToolkitBundle";

interface Secret {
    envVarKey(): string;
    fetch(): Option<string>;
}

function Secret(args: {envVarKey: string}): Secret {
    let self: Secret = {
        envVarKey,
        fetch
    };
    let _envVarKey: string;

    (function() {
        _envVarKey = args.envVarKey;
    })();

    function envVarKey(): string {
        return _envVarKey;
    }

    function fetch(): Option<string> {
        let content: string | undefined = process
            ?.env
            ?.[envVarKey()];
        if (!content) {
            return None;
        }
        return Some<string>(content);
    }

    return self;
}

export { Secret };