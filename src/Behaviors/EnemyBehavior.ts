import { Space, TransformNode, Vector3 } from "@babylonjs/core";
import { BehaviorName, ElementType } from "../Gobal";
import UpdateableBehavior from "../UpdateableBehavior";

export default class EnemyBehavior extends UpdateableBehavior {
    public name = BehaviorName.Enemy;

    private _node: TransformNode | null = null;

    public speed: number;
    public element: ElementType;

    constructor(speed: number, element: ElementType, health: number) {
        super();
        this.speed = speed;
        this.element = element;
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
