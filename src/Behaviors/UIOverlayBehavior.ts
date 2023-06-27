import { AdvancedDynamicTexture, TextBlock, Control } from "@babylonjs/gui";
import { BehaviorName, gold, objects, Tag } from "../Global";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";
import { TagBehavior } from "./TagBehavior";
import WaveSpawner from "./WaveSpawnerBehavior";

export class UIOverlayBehavior extends UpdateableBehavior {
    public name = BehaviorName.UIOverlay;

    private _guiTexture: AdvancedDynamicTexture;
    private _enemyCountText: TextBlock;
    private _enemiesInWaveText: TextBlock;
    private _goldText: TextBlock;

    constructor() {
        super();
        this._guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        const sharedStyleSettings: Record<string, any> = {
            color: "white",
            fontSize: 24,
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            left: 0,
            enemyCountTextPaddingX: 0,
            enemyCountTextPaddingY: 0
        };
        const applyStyle = (control: Control, settings: Record<string, any>) => {
            for (let settingName in settings) {
                control[settingName] = settings[settingName];
            }
        };

        this._enemyCountText = new TextBlock("enemyCountText", "Enemies: 0");
        applyStyle(this._enemyCountText, sharedStyleSettings);
        this._enemyCountText.top = 0;
        this._guiTexture.addControl(this._enemyCountText);

        this._enemiesInWaveText = new TextBlock("enemiesInWaveText", "Enemies in the Wave: 0");
        applyStyle(this._enemiesInWaveText, sharedStyleSettings);
        this._enemiesInWaveText.top = 30;
        this._guiTexture.addControl(this._enemiesInWaveText);

        this._goldText = new TextBlock("gold", "Gold: 0");
        applyStyle(this._goldText, sharedStyleSettings);
        this._goldText.top = 60;
        this._guiTexture.addControl(this._goldText);
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }

    public update(): void {
        // Update the text values based on your game logic
        const enemyCount = objects.filter(object => {
                const tag2 = object.getBehaviorByName(BehaviorName.Tag) as TagBehavior;
                if (tag2 && tag2.tags.includes(Tag.Enemy)) {
                    return object;
                }
        }).length;
        let enemiesInWave: number;
        const waveSpawner = this._node.getChildren().find(function(node) {
            return node.name === "WaveSpawner";
        });

        if (waveSpawner && waveSpawner.getBehaviorByName(BehaviorName.WaveSpawner) as WaveSpawner) {
            enemiesInWave = (waveSpawner.getBehaviorByName(BehaviorName.WaveSpawner) as WaveSpawner).enemiesInwave;
        } else {
            enemiesInWave = 0;
        }

        this._enemyCountText.text = `Enemies: ${enemyCount}`;
        this._enemiesInWaveText.text = `Enemies in the next Wave: ${enemiesInWave}`;
        this._goldText.text = `Gold: ${gold}`;
    }
    public hide(): void {
        this._enemyCountText.isVisible = false;
        this._enemiesInWaveText.isVisible = false;
    }

    public show(): void {
        this._enemyCountText.isVisible = true;
        this._enemiesInWaveText.isVisible = true;
    }
}