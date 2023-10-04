import { ElementType } from "../../Global";
import CollisionSystem from "../../Systems/ElementSystem";
import TestingSystem, { Asserts } from "../../Systems/TestingSystem";


function testElementSystem(): void {
    const halfMultiplierPairs = [
        [ElementType.Fire, ElementType.Water],
        [ElementType.Earth, ElementType.Air]
        //...
    ];
    const doubleMultiplierPairs = [
        
        //...
    ];
    for (const pair of halfMultiplierPairs) {
        Asserts.equals(CollisionSystem.calculateDamage(1, pair[0], pair[1]), 0.5);
        Asserts.equals(CollisionSystem.calculateDamage(1, pair[1], pair[0]), 0.5);
    }
    // everyone else
    Asserts.equals(CollisionSystem.calculateDamage(1, ElementType.Fire, ElementType.Water), 0.6);
}

TestingSystem.registerTest(testElementSystem);
