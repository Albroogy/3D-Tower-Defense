import { Color3, StandardMaterial } from "@babylonjs/core";
import UpdateableNode from "./UpdateableNode";

// Key Information
export const allPressedKeys: Record<string, boolean> = {};
window.addEventListener("keydown", function (event) {
    allPressedKeys[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
    allPressedKeys[event.keyCode] = false;
});
export const KEYS = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    Space: 32,
    ArrowLeft: 37,
    ArrowRight: 39,
    ArrowUp: 38,
    ArrowDown: 40,
    SpaceBar: 32,
    Escape: 27,
    E: 69,
    One: 49,
    Two: 50,
    Three: 51,
    Four: 52,
};

export enum BehaviorName {
    Enemy = "Enemy",
    Projectile = "Projectile",
    Tower = "Tower",
    Tag = "Tag",
    WaveSpawner = "WaveSpawner",
    HealthBar = "HealthBar"
}

export enum Tag {
    CubeEnemy,
    SphereEnemy,
    Enemy,
    Tower,
    Projectile
}

export enum ElementType {
    Fire,
    Earth,
    Water,
    Air,
    Metal,
}

export const ElementColor: Record<ElementType, Color3> = {
    [ElementType.Fire]: new Color3(1, 0, 0),       // Fire element is red
    [ElementType.Earth]: new Color3(0.6, 0.4, 0), // Earth element is brown
    [ElementType.Water]: new Color3(0, 0, 1),     // Water element is blue
    [ElementType.Air]: new Color3(0.8, 0.8, 1),   // Air element is light blue
    [ElementType.Metal]: new Color3(0.8, 0.8, 0.8) // Metal element is gray
};

export const ElementMaterial: Record<ElementType, StandardMaterial> = {
    [ElementType.Fire]: null,
    [ElementType.Earth]: null,
    [ElementType.Water]: null,
    [ElementType.Air]: null,
    [ElementType.Metal]: null 
};

export const objects: Array<UpdateableNode> = [];

export const OFFSET = 1;

export function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum);
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex] as T[keyof T];
}