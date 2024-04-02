export const colors = (function() {
    let instance: {
        purple: typeof purple;
        activePurple: typeof activePurple;
        obsidian: typeof obsidian;
        deepObsidian: typeof deepObsidian;
        steelGradient: typeof steelGradient;
    };

    const purple = () => "#615FFF" as const;
    
    const activePurple = () => "#7774FF" as const;

    const obsidian = () => "#171717" as const;

    const deepObsidian = () => "#161616" as const;

    const steelGradient = (direction: string) => `linear-gradient(${direction}, transparent, #505050) 1` as const;

    return function() {
        if (!instance) instance = {
            purple,
            activePurple,
            obsidian,
            deepObsidian,
            steelGradient
        };
        return instance;
    }
})();