


export type Key = string & ({__type: "Key"});

export function Key(_key: string) {
    return _key as Key;
}

export function EnvVarKey(_envkey: string) {
    const key: string | undefined = process.env?.[envkey];
    
}