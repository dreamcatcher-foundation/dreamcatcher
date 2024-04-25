import type ISolCompilationMaterial from "../material/ISolCompilationMaterial";

export default interface ISolCompiler {
    cache: {[name: string]: ISolCompilationMaterial | undefined};
    compile: (name: string, path: string, fSrcDir: string) => boolean;
}