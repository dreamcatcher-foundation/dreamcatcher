export default interface IOk {
    ok: boolean;
    markSafe: () => boolean;
    markUnsafe: () => boolean;
}