import { Color3, Mesh, MeshBuilder, Space, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import { BehaviorName, objects, Tag, ElementType, ElementColor } from "../Gobal";
import ProjectileBehavior from "./ProjectileBehavior";
import { TagBehavior } from "./TagBehavior";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export default class TowerBehavior extends UpdateableBehavior {
    public name = BehaviorName.Tower;

    private _node: TransformNode | null = null;

    private _timerId: any;

    public target: null | TransformNode = null;
    constructor(private _attackSpeed: number, private _towerAttackRadius: number, public element: ElementType, public mesh: Mesh) {
        super();
    }

    public attach(target: TransformNode): void {
        this._node = target;

        const towerMaterial = new StandardMaterial("towerMaterial", this._node.getScene());
        towerMaterial.diffuseColor = ElementColor[this.element]; 

        this.mesh.material = towerMaterial;

        this.mesh.setParent(this._node);

        // this.mesh.position = this._node.position;
    }

    attackTarget(): void { 
        this._timerId = setInterval(() => {
            let rockContainerNode = new UpdateableNode("rock", this._node.getScene());
            const targetPosition = this.target.position;
            const direction = this._node.position.subtract(targetPosition).normalize();

            const projectileBehavior = new ProjectileBehavior(2, 10, direction, this.element);
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
            rockContainerNode.setParent(this._node);

            objects.push(rockContainerNode);
            
            }, 1000 - this._attackSpeed * 100);
    }

    changeTarget(target: TransformNode) {
        clearInterval(this._timerId);
        this.target = target;
        this.attackTarget()
    }

    get towerAttackRadius(){
        return this._towerAttackRadius;
    }
}
