import { Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";
import { BehaviorName, objects, Tag, ElementType, ElementMaterial as ElementMaterial, IN_GAME_SECOND, TimerMode, TowerAttributesType, TowerAbilitiesType } from "../Global";
import ProjectileBehavior from "./ProjectileBehavior";
import { TagBehavior } from "./TagBehavior";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";
import { TimerBehavior } from "./TimerBehavior";

export default class TowerBehavior extends UpdateableBehavior {
    public name = BehaviorName.Tower;
    
    private _mesh: Mesh | null = null;
    public stats: TowerAttributesType;
    public abilities: TowerAbilitiesType;

    public target: null | UpdateableNode = null;
    constructor(public element: ElementType, stats: TowerAttributesType, abilities: TowerAbilitiesType) {
        super();
        this.stats = stats
        this.abilities = abilities
    }

    public attach(target: UpdateableNode): void {
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

        const timerBehavior = this._node.getBehaviorByName(BehaviorName.Timer) as TimerBehavior;
        timerBehavior.start(() => this.shootIfTargetIsAvailable(), IN_GAME_SECOND/this.stats.attackSpeed, TimerMode.Interval);
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
        const projectileBehavior = new ProjectileBehavior(100, 10, direction, this.element, this.abilities);
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
        const findClosestByTag = (objects: Array<UpdateableNode>, tower: UpdateableNode): UpdateableNode | null => {
            // const isObjectDisposedOf = (o: UpdateableNode) => !o.isDisposed();

            if (!this) {
                return null;
            }

            const isObjectAnEnemy = (o: UpdateableNode) => (o.getBehaviorByName(BehaviorName.Tag) as TagBehavior)?.hasTag(Tag.Enemy);
            const isEnemyInRadius = (e: UpdateableNode) => tower.position.subtract(e.position).lengthSquared() <= (tower.getBehaviorByName(BehaviorName.Tower) as TowerBehavior).towerAttackRadiusSquared;
          
            const allPotentialEnemies = objects.filter(isObjectAnEnemy).filter(isEnemyInRadius);
          
            if (allPotentialEnemies.length === 0) {
              return null;
            }
          
            const closestEnemy = allPotentialEnemies.reduce((closest, current) => {
              const distanceToClosest = tower.position.subtract(closest.position).lengthSquared();
              const distanceToCurrent = tower.position.subtract(current.position).lengthSquared();
              return distanceToCurrent < distanceToClosest ? current : closest;
            }, allPotentialEnemies[0]);
          
            return closestEnemy;
        };
        this.target = findClosestByTag(objects, this._node as UpdateableNode);
    }

    public clearTarget() {
        this.target = null;
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
    }

    get towerAttackRadius(){
        return this.stats.range;
    }
    
    get towerAttackRadiusSquared(){
        return this.stats.range * this.stats.range;
    }
}
