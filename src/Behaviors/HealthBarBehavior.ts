import { TransformNode, Vector3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, TextBlock, Rectangle } from "@babylonjs/gui";
import { BehaviorName, objects } from "../Gobal";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export class HealthBar {
    private _healthBarBackground: Rectangle;
    private _healthBar: Rectangle;

    private _guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    private _position: Vector3;
    private _maxHealth: number;
    private _currentHealth: number;
    private _color: string;
    private _width: number;
    private _height: number;
    private _isAttached: boolean;
    private _node: UpdateableNode;

    constructor(position: Vector3, maxHealth: number, color: string, width: number, height: number, isAttached: boolean) {
        this._maxHealth = maxHealth;
        this._currentHealth = maxHealth;
        this._color = color;
        this._width = width;
        this._height = height;
        this._isAttached = isAttached;
        this._position = position;

        this._healthBarBackground = new Rectangle("healthBarBackground");
        this._healthBarBackground.width = this._width + "px";
        this._healthBarBackground.height = this._height + "px";
        this._healthBarBackground.color = "gray";
        this._healthBarBackground.thickness = 0;
        this._healthBarBackground.background = "red";
        this._guiTexture.addControl(this._healthBarBackground);

        this._healthBar = new Rectangle("healthBar");
        this._healthBar.color = this._color;
        this._healthBar.thickness = 0;
        this._healthBarBackground.addControl(this._healthBar);
    }
    
    public attach(target: UpdateableNode): void {
        this._node = target;
        if (this._isAttached) {
            this._healthBarBackground.linkWithMesh(this._node);
        }
    }
    public update(): void {
        this._healthBar.width = (this._currentHealth / this._maxHealth) * 100 + "%";
        // console.log((this._currentHealth / this._maxHealth) * 100 + "%")
    }
    public setHealth(health: number): void {
        this._currentHealth = health;
    }
    public reduceHealth(damage: number = 1) {
        this._currentHealth -= damage;
        if (this._currentHealth < 0) {
            this._node.dispose();
            this._guiTexture.removeControl(this._healthBarBackground);
            this._guiTexture.removeControl(this._healthBar);
        }
    }
}

export default class HealthBarBehavior extends UpdateableBehavior { 
    public name = BehaviorName.HealthBar;

    private _healthBars: Array<HealthBar>;

    constructor(healthBars: Array<HealthBar>) {
        super();
        this._healthBars = healthBars;
    }
    
    public update(): void {
        for (const bar of this._healthBars) {
            bar.update();
        }
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
        for (const bar of this._healthBars) {
            bar.attach(target);
        }
    }

    public get healthBars() {
        return this._healthBars;
    }

    public reduceHealth(damage: number, healthBar: number): void {
        this._healthBars[healthBar].reduceHealth(damage);
    }
}