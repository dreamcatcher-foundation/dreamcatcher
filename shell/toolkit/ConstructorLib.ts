export const builder = (function() {
    let instance:{
        createReference: typeof createReference;
        createInstance: typeof createInstance;
    };

    function createReference(singleton:()=>object):()=>object {
        return singleton;
    }

    function createInstance(singleton:()=>object):object {
        return Object.assign({}, singleton());
    }

    return function() {return instance || (instance = {
        createReference,
        createInstance
    });}
})();

builder().createInstance(builder);