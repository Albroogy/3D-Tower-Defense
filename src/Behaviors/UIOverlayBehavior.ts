import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";
import { BehaviorName, objects, Tag } from "../Gobal";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";
import { TagBehavior } from "./TagBehavior";
import WaveSpawner from "./WaveSpawnerBehavior";

export class UIOverlayBehavior extends UpdateableBehavior {
    public name = BehaviorName.UIOverlay;

    private _guiTexture: AdvancedDynamicTexture;
    private _enemyCountText: TextBlock;
    private _enemiesInWaveText: TextBlock;

    constructor() {
        super();
        this._guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        this._enemyCountText = new TextBlock("enemyCountText", "Enemies: 0");
        this._enemyCountText.color = "white";
        this._enemyCountText.fontSize = 24;
        const enemyCountTextPaddingX = 100;
        const enemyCountTextPaddingY = 60;
        this._enemyCountText.left = -screenWidth/2 + enemyCountTextPaddingX;
        this._enemyCountText.top = -screenHeight/2 + enemyCountTextPaddingY;
        this._guiTexture.addControl(this._enemyCountText);
        // this._enemyCountText.isVisible = false;

        this._enemiesInWaveText = new TextBlock("enemiesInWaveText", "Enemies in the Wave: 0");
        this._enemiesInWaveText.color = "white";
        this._enemiesInWaveText.fontSize = 24;
        const enemiesInWaveTextPaddingX = 190;
        const enemiesInWaveTextPaddingY = 100;
        this._enemiesInWaveText.left = -screenWidth/2 + enemiesInWaveTextPaddingX;
        this._enemiesInWaveText.top = -screenHeight/2 + enemiesInWaveTextPaddingY;
        this._guiTexture.addControl(this._enemiesInWaveText);
        // this._enemiesInWaveText.isVisible = false;
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