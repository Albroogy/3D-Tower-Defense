export class Asserts {
    public static equals<T>(v1: T, v2: T): void { 
        console.assert(v1 == v2, `${v1} != ${v2} but should be equal`);
    }
}

export type TestFunctor = () => void;
export default class TestingSystem {
    public static testFunctions: Array<TestFunctor> = [];

    public static registerTest(test: TestFunctor): void {
        this.testFunctions.push(test);
    }

    public static runAll(): void {
        console.log("Running all tests!");
        for (const func of this.testFunctions) {
            func();
        }
    }
}