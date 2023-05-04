import { Space, TransformNode, Vector3 } from "@babylonjs/core";
import UpdateableBehavior from "./UpdateableBehavior";

export default class Enemy extends UpdateableBehavior {
    public speed: number;
    private _node: TransformNode | null = null;

    constructor(speed: number) {
        super();
        this.speed = speed;
    }

    public attach(target: TransformNode): void {
        this._node = target;
    }

    public update(dt: number): void {
        const targetPosition = new Vector3(0, 0, 0);
        this._node.lookAt(targetPosition);
        const direction = targetPosition.subtract(this._node.getAbsolutePosition()).normalize();
        direction.y = 0;
        this._node.translate(direction, this.speed * dt, Space.WORLD);
    }
}
