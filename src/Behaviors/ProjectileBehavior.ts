import { Mesh, TransformNode, Vector3 } from "@babylonjs/core";
import { BehaviorName, ElementType, TowerAbility, TowerAbilitiesType } from "../Global";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export default class ProjectileBehavior extends UpdateableBehavior{
    public name = BehaviorName.Projectile;

    public abilities: TowerAbilitiesType;
    public shotsLeft: number

    constructor(private _speed: number, private _damage: number, private _direction: Vector3, public element: ElementType, abilities: TowerAbilitiesType) {
        super();
        this.abilities = abilities;

        if (this.abilities.includes(TowerAbility.PiercingShots)) {
            this.shotsLeft = 5;
        }
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }

    update(dt: number): void {
        if (this._node == null) {
            return;
        }
        this._node.position.x += this._direction.x * this._speed * dt;
        this._node.position.z += this._direction.z * this._speed * dt;
    }
}