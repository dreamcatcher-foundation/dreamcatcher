import { Console } from "./class/host/console/Console.ts";

class App {
    public static async run() {
        Console.poll();
        return;
    }
}

App.run();