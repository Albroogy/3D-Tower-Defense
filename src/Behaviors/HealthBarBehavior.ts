import { TransformNode, Vector3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, TextBlock, Rectangle } from "@babylonjs/gui";
import { BehaviorName, objects } from "../Gobal";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export class HealthBar {
    private _healthBarBackground: Rectangle;
    private _healthBar: Rectangle;

    private _guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    private _maxHealth: number;
    private _currentHealth: number;
    private _color: string;
    private _width: number;
    private _height: number;
    private _isAttached: boolean;
    private _node: UpdateableNode;

    constructor(maxHealth: number, color: string, width: number, height: number, isAttached: boolean) {
        this._maxHealth = maxHealth;
        this._currentHealth = maxHealth;
        this._color = color;
        this._width = width;
        this._height = height;
        this._isAttached = isAttached;

        this._healthBarBackground = new Rectangle("healthBarBackground");
        this._healthBarBackground.width = this._width + "px";
        this._healthBarBackground.height = this._height + "px";
        this._healthBarBackground.thickness = 0;
        this._healthBarBackground.background = "gray";
        this._guiTexture.addControl(this._healthBarBackground);

        this._healthBar = new Rectangle("healthBar");
        this._healthBar.background = this._color;
        this._healthBar.leftInPixels = 0;
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
        const healthPercentage = this._currentHealth / this._maxHealth;
        const healthBarWidth = healthPercentage * this._width;
        const remainingWidth = this._width - healthBarWidth;
      
        // Update the width of the health bar
        this._healthBar.width = healthBarWidth + "px";
      
        // Adjust the position of the health bar
        this._healthBar.leftInPixels = -remainingWidth;
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