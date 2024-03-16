import {exec} from "child_process";


const doka = (function() {
    let instance;



    function compile() {

    }




    return function() {
        if (!instance) {
            return instance = {
                compile
            }
        }
        return instance;
    }
})();


