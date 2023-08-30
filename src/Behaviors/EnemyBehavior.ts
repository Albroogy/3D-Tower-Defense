import { BehaviorName, ElementType, TowerAbilitiesType } from "../Global";
import UpdateableBehavior from "../BabylonUpdateable/UpdateableBehavior";
import UpdateableNode from "../BabylonUpdateable/UpdateableNode";

export default class EnemyBehavior extends UpdateableBehavior {
    public name = BehaviorName.Enemy;

    public speed: number;
    public element: ElementType;
    
    public abilities: TowerAbilitiesType;

    constructor(speed: number, element: ElementType, health: number) {
        super();
        this.speed = speed;
        this.element = element;
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }
}
