import { Color3, Mesh, MeshBuilder, Space, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { BehaviorName, objects, Tag, ElementType, ElementColor } from "../Gobal";
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

        const towerMaterial = new StandardMaterial("towerMaterial", this._node.getScene());
        towerMaterial.diffuseColor = ElementColor[this.element]; 

        this._mesh.material = towerMaterial;

        this._mesh.setParent(this._node);
        this._mesh.setPositionWithLocalVector(Vector3.ZeroReadOnly);
    }

    public attackTarget(): void {
        if (!this.target) {
            return;
        }
        const shoot = () => {
            let rockContainerNode = new UpdateableNode("rock", this._node.getScene());
            const targetPosition = this.target.getAbsolutePosition();
            const towerGroudPosition = this._node.position.clone();
            towerGroudPosition.y = 0;
            const direction = targetPosition.subtract(towerGroudPosition).normalize();

            const projectileBehavior = new ProjectileBehavior(10, 10, direction, this.element);
            const tagBehavior = new TagBehavior([Tag.Projectile]);
            rockContainerNode.addBehavior(projectileBehavior);
            rockContainerNode.addBehavior(tagBehavior);

            const rockMaterial = new StandardMaterial("rockMaterial", this._node.getScene());
            rockMaterial.diffuseColor = ElementColor[this.element]; 
            
            const rockMesh = MeshBuilder.CreateBox("rock", {
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
        };
        this._timerId = setInterval(shoot, 1000/this._attackSpeed);
    }

    public chooseTarget(target: TransformNode) {
        this.target = target;
        this.attackTarget()
    }

    public clearTarget() {
        clearInterval(this._timerId);
        this.target = null;
        console.log("clearTarget")
    }

    public update(dt: number): void {
        if (this.target) {
            if (this.target.isDisposed() || this._node.position.subtract(this.target.position).lengthSquared() > this.towerAttackRadiusSquared) {
                this.clearTarget();
            }
        }
    }

    get towerAttackRadius(){
        return this._towerAttackRadius;
    }
    
    get towerAttackRadiusSquared(){
        return this._towerAttackRadius * this._towerAttackRadius;
    }
}
