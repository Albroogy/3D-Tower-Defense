import { Button, AdvancedDynamicTexture } from "@babylonjs/gui";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export class ButtonBehavior extends UpdateableBehavior {
    private _onPointerDown: () => void;
    private _onPointerUp: () => void;
    private _guiTexture: AdvancedDynamicTexture;

    constructor(width: number, height: number, onPointerDown?: () => void) {
        super();

        this._guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Create the button
        const button = Button.CreateSimpleButton("button", "text");
        button.width = `${width}px`;
        button.height = `${height}px`;
        button.color = "transparent"; // Make the button text color transparent
        button.background = "transparent"; // Make the button background transparent
        button.cornerRadius = 5;
        button.thickness = 0;
        button.onPointerDownObservable.add(this._onPointerDown);
        button.left = `${(width - button.widthInPixels) / 2}px`;
        button.top = `${(height - button.heightInPixels) / 2}px`;
        this._guiTexture.addControl(button);
    }

    public set onPointerDown(callback: () => void) {
        this._onPointerDown = callback;
    }

    public set onPointerUp(callback: () => void) {
        this._onPointerUp = callback;
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }
}