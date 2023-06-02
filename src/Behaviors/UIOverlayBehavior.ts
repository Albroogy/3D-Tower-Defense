import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";
import { BehaviorName, objects, Tag } from "../Gobal";
import UpdateableBehavior from "../UpdateableBehavior";
import { TagBehavior } from "./TagBehavior";

export class UIOverlayBehavior extends UpdateableBehavior {
  public name = BehaviorName.UIOverlay;

  private _guiTexture: AdvancedDynamicTexture;
  private _enemyCountText: TextBlock;
  private _enemiesInWaveText: TextBlock;

  constructor() {
    super();
    this._guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this._enemyCountText = new TextBlock("enemyCountText", "Enemies: 0");
    this._enemyCountText.color = "white";
    this._enemyCountText.fontSize = 48;
    this._enemyCountText.top = "20px";
    this._enemyCountText.left = "20px";
    this._guiTexture.addControl(this._enemyCountText);

    this._enemiesInWaveText = new TextBlock("enemiesInWaveText", "Enemies in the Wave: 0");
    this._enemiesInWaveText.color = "white";
    this._enemiesInWaveText.fontSize = 48;
    this._enemiesInWaveText.top = "60px";
    this._enemiesInWaveText.left = "20px";
    this._guiTexture.addControl(this._enemiesInWaveText);
  }

  public update(): void {
    // Update the text values based on your game logic
    const enemyCount = objects.filter(object => {
        const tag2 = object.getBehaviorByName(BehaviorName.Tag) as TagBehavior;
        return tag2 != null && tag2.tags.includes(Tag.Enemy);
    });
    const enemiesInWave = 5; // Replace with your actual enemies in the wave count

    this._enemyCountText.text = `Enemies: ${enemyCount}`;
    this._enemiesInWaveText.text = `Enemies in the next Wave: ${enemiesInWave}`;
  }
}