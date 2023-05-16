import { Color3 } from "@babylonjs/core";
import UpdateableNode from "./UpdateableNode";

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

export const ElementColor = {
    [ElementType.Fire]: new Color3(1, 0, 0),       // Fire element is red
    [ElementType.Earth]: new Color3(0.6, 0.4, 0), // Earth element is brown
    [ElementType.Water]: new Color3(0, 0, 1),     // Water element is blue
    [ElementType.Air]: new Color3(0.8, 0.8, 1),   // Air element is light blue
    [ElementType.Metal]: new Color3(0.8, 0.8, 0.8) // Metal element is gray
};

export const objects: Array<UpdateableNode> = [];

export const OFFSET = 1;

export function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum);
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex] as T[keyof T];
}