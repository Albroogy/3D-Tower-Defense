import { TransformNode } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, TextBlock, Rectangle } from "@babylonjs/gui";
import { BehaviorName } from "../Gobal";
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

    constructor(maxHealth: number, color: string, width: number, height: number) {
        this._maxHealth = maxHealth;
        this._currentHealth = maxHealth;
        this._color = color;
        this._width = width;
        this._height = height;

        this._healthBarBackground = new Rectangle("healthBarBackground");
        this._healthBarBackground.width = this._width;
        this._healthBarBackground.height = this._height;
        this._healthBarBackground.color = "gray";
        this._healthBarBackground.thickness = 0;
        this._healthBarBackground.background = "white";
        this._guiTexture.addControl(this._healthBarBackground);

        this._healthBar = new Rectangle("healthBar");
        this._healthBar.width = "100%";
        this._healthBar.height = "100%";
        this._healthBar.color = this._color;
        this._healthBar.thickness = 0;
        this._healthBarBackground.addControl(this._healthBar);
    }
    
    public update(): void {
        this._healthBar.width = (this._currentHealth / this._maxHealth) * 100 + "%";
    }
    public setHealth(health: number): void {
        this._currentHealth = health;
    }
}

export default class HealthBarComponent extends UpdateableBehavior { 
    public name = BehaviorName.HealthBar;

    private _node: UpdateableNode

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
    }

    public get healthBars() {
        return this._healthBars;
    }
}