import { Color3, Engine, Scene, StandardMaterial } from "@babylonjs/core";
import UpdateableNode from "./UpdateableNode";
export const allPressedKeys: Record<string, boolean> = {};

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
    P: 80,
    Plus: 187,
    Minus: 189,
    ZERO: 48,
};


export enum BehaviorName {
    Enemy = "Enemy",
    Projectile = "Projectile",
    Tower = "Tower",
    Tag = "Tag",
    WaveSpawner = "WaveSpawner",
    HealthBar = "HealthBar",
    Timer = "Timer",
    StateMachine = "StateMachine",
    CardHand = "CardHand",
    UIOverlay = "UIOverlay",
    WaypointMovement = "WaypointMovement",
    Skeleton = "Skeleton"
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

export enum TimerMode {
    Interval,
    Timeout
}

export const ElementColor: Record<ElementType, Color3> = {
    [ElementType.Fire]: new Color3(1, 0, 0),       // Fire element is red
    [ElementType.Earth]: new Color3(0.6, 0.4, 0), // Earth element is brown
    [ElementType.Water]: new Color3(0, 0, 1),     // Water element is blue
    [ElementType.Air]: new Color3(0.8, 0.8, 1),   // Air element is light blue
    [ElementType.Metal]: new Color3(0.8, 0.8, 0.8) // Metal element is gray
};

export let ElementMaterial: Record<ElementType, StandardMaterial> = {
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

export const IN_GAME_SECOND: number = 1000;

// Variable to store event listeners
let eventListeners = [];

export function addEventListenerCustom(type: string, listener: EventListenerOrEventListenerObject) {
    // Add the event listener
    document.addEventListener(type, listener);
  
    // Store the event listener and its type
    eventListeners.push({ type, listener });
  }
  
// Function to remove all event listeners of a certain type
export function removeEventListenersOfType(type: string) {

    // Iterate over the stored event listeners

    for (let i = eventListeners.length - 1; i >= 0; i--) {
        const { eventType, listener } = eventListeners[i];

        // Check if the event listener matches the specified type
        if (eventType === type) {
            // Remove the event listener
            document.removeEventListener(type, listener);

            // Remove the event listener from the stored array
            eventListeners.splice(i, 1);
        }
    }
}

// create the canvas html element and attach it to the webpage
export const canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.id = "gameCanvas";
document.body.appendChild(canvas);

export const engine = new Engine(canvas, true);
export const scene = new Scene(engine);

// Key Information
window.addEventListener("keydown", function (event) {
    allPressedKeys[event.keyCode] = true;

    if (event.keyCode === KEYS.P) {
        if (globalDTMultiplier == 0) {
            globalDTMultiplier = 1;
        } else {
            globalDTMultiplier = 0;
        }
    }

    if (event.keyCode === KEYS.Plus) {
        globalDTMultiplier *= 2;
    }

    if (event.keyCode === KEYS.Minus) {
        globalDTMultiplier /= 2;
    }

    if (event.keyCode === KEYS.ZERO) {
        globalDTMultiplier = 1;
    }

});
window.addEventListener("keyup", function (event) {
    allPressedKeys[event.keyCode] = false;
});

export let globalDTMultiplier = 1;
export let gold = 0;

export function addGold(amount: number) {
    gold += amount;
}

export function subtractGold(amount: number) {
    gold -= amount;
}