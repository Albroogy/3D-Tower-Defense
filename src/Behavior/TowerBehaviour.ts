import { Color3, Mesh, MeshBuilder, Space, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { BehaviorName, objects, Tag, ElementType, ElementColor, ElementMaterial as ElementMaterial } from "../Gobal";
import ProjectileBehavior from "./ProjectileBehavior";
import { TagBehavior } from "./TagBehavior";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export default class TowerBehavior extends UpdateableBehavior {
    public name = BehaviorName.Tower;

    private _node: TransformNode | null = null;
    private _mesh: Mesh | null = null;

    private _timerId: any;

    public target: null | TransformNode = null;
    constructor(private _attackSpeed: number, private _towerAttackRadius: number, public element: ElementType) {
        super();
    }

    public attach(target: TransformNode): void {
        this._node = target;
        
        this._mesh = MeshBuilder.CreateBox("towerMesh1", {
            width: 0.5,
            depth: 0.5,
            height: 2.5
        }, this._node.getScene());

        const towerMaterial = ElementMaterial[this.element];

        this._mesh.material = towerMaterial;

        this._mesh.setParent(this._node);
        this._mesh.setPositionWithLocalVector(Vector3.ZeroReadOnly);
        this.shootIfTargetIsAvailable();
    }

    public attackTarget(): void {
        if (!this.target) {
            return;
        }
        const targetPosition = this.target.getAbsolutePosition();
        const towerGroudPosition = this._node.position.clone();
        towerGroudPosition.y = 0;
        const direction = targetPosition.subtract(towerGroudPosition).normalize();

        let rockContainerNode = new UpdateableNode("Projectile-Container", this._node.getScene());
        const projectileBehavior = new ProjectileBehavior(10, 10, direction, this.element);
        rockContainerNode.addBehavior(projectileBehavior);
        const tagBehavior = new TagBehavior([Tag.Projectile]);
        rockContainerNode.addBehavior(tagBehavior);

        const rockMaterial = ElementMaterial[this.element]; 
        
        const rockMesh = MeshBuilder.CreateBox("Projectile", {
            width: 0.1,
            depth: 0.25,
            height: 0.25
        }, this._node.getScene());
        rockMesh.material = rockMaterial;

        rockMesh.setParent(rockContainerNode);
        rockMesh.setPositionWithLocalVector(Vector3.ZeroReadOnly);
        rockContainerNode.setParent(this._node);
        rockContainerNode.setPositionWithLocalVector(new Vector3(0, -this._node.position.y, 0));
        objects.push(rockContainerNode);
    }

    public chooseTarget() {
        // const findClosestByTag = (objects: Array<UpdateableNode>, tower: UpdateableNode): UpdateableNode | null => {
        //     // const isObjectDisposedOf = (o: UpdateableNode) => !o.isDisposed();
        //     const isObjectAnEnemy = (o: UpdateableNode) => (o.getBehaviorByName(BehaviorName.Tag) as TagBehavior)?.hasTag(Tag.Enemy);
        //     const isEnemyInRadius = (e: UpdateableNode) => tower.position.subtract(e.position).lengthSquared() <= (tower.getBehaviorByName(BehaviorName.Tower) as TowerBehavior).towerAttackRadiusSquared;
          
        //     const allPotentialEnemies = objects.filter(isObjectAnEnemy).filter(isEnemyInRadius);
          
        //     if (allPotentialEnemies.length === 0) {
        //       return null;
        //     }
          
        //     const closestEnemy = allPotentialEnemies.reduce((closest, current) => {
        //       const distanceToClosest = tower.position.subtract(closest.position).lengthSquared();
        //       const distanceToCurrent = tower.position.subtract(current.position).lengthSquared();
        //       return distanceToCurrent < distanceToClosest ? current : closest;
        //     }, allPotentialEnemies[0]);
          
        //     return closestEnemy;
        // };
        // this.target = findClosestByTag(objects, this._node as UpdateableNode);
    }

    public clearTarget() {
        clearInterval(this._timerId);
        this.target = null;
        console.log("clearTarget")
    }

    private shootIfTargetIsAvailable(): void {
        if (this.target) {
            if (this.target.isDisposed() || this._node.position.subtract(this.target.position).lengthSquared() > this.towerAttackRadiusSquared) {
                this.clearTarget();
            }
        }
        if (!this.target) {
            this.chooseTarget();
        }
        if (this.target) {
            this.attackTarget();
        }

        this._timerId = setTimeout(() => this.shootIfTargetIsAvailable(), 1000/this._attackSpeed);
    }

    get towerAttackRadius(){
        return this._towerAttackRadius;
    }
    
    get towerAttackRadiusSquared(){
        return this._towerAttackRadius * this._towerAttackRadius;
    }
}
