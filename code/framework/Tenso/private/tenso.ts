


const memory = (function() {
    let instance;

    return function() {
        if (!instance) {
            return instance = {}
        }
        return instance;
    }
})();


