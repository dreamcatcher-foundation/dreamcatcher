import UniqueTag from "./UniqueTag.ts";

export default class Tags {
    private static _$global: UniqueTag = new UniqueTag();
    private static _$errors: UniqueTag = new UniqueTag();
    private static _$events: UniqueTag = new UniqueTag();

    public static $global(): UniqueTag {
        return Tags._$global;
    }

    public static $errors(): UniqueTag {
        return Tags._$errors;
    }

    public static $events(): UniqueTag {
        return Tags._$events;
    }
}