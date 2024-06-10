import { Mixin } from "ts-mixer";

class A {
    public constructor() {}

    public A(): this {
        console.log("constructor A");
        return this;
    }
}

class B {
    public constructor() {}

    public B(): this {
        console.log("constructor B");
        return this;
    }

    public bark(): string {
        return "barkB"
    }
}

class C extends Mixin(B) {
    public constructor() { super(); }

    public C(): this {
        console.log("constructor C");
        return this;
    }

    public bark(): string {
        return "barkC";
    }
}

class Polymorphic extends Mixin(A, B, C) {
    public Polymorphic(): this {
        this.A();
        this.B();
        this.C();
        return this;
    }
}

const p = new Polymorphic().Polymorphic();


