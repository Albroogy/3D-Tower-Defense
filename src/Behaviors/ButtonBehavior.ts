import UpdateableBehavior from "../UpdateableBehavior";

export class ButtonBehavior extends UpdateableBehavior {
    private _onPointerDown: () => void;
    private _onPointerUp: () => void;

    constructor() {
        super();
    }

    public set onPointerDown(callback: () => void) {
        this._onPointerDown = callback;
    }

    public set onPointerUp(callback: () => void) {
        this._onPointerUp = callback;
    }
}