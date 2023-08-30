import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";
import { BehaviorName } from "../Global";
import { Material, Vector3 } from "@babylonjs/core";

export class SkeletonBehavior extends UpdateableBehavior {
    public name = BehaviorName.Skeleton;

    private _skeletalMeshName: string;
    private _material: Material;
    private _mesh: AbstractMesh;

    constructor(name: string, material: Material) {
        super();
        this._skeletalMeshName = name;
        this._material = material;
    }

    public attach(target: UpdateableNode): void {
        this._node = target;

        // Import the skeleton and associated animations
        SceneLoader.ImportMesh("", "./assets/meshes/", "dummy3.babylon", this._node.getScene(), (newMeshes, particleSystems, skeletons) => {
            const skeletalMesh = newMeshes[0];
            const skeleton = skeletons[0];
            this._mesh = skeletalMesh;
            this._mesh.rotate(Vector3.UpReadOnly, -Math.PI / 2);
            this._mesh.name = this._skeletalMeshName;
            this._mesh.material = this._material;

            // Set the parent of the skeletal mesh
            skeletalMesh.setParent(this._node);
            skeletalMesh.setPositionWithLocalVector(Vector3.ZeroReadOnly);

            const walkRange = skeleton.getAnimationRange("YBot_Walk");

            if (walkRange) {
                const walkAnim = this._node.getScene().beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 1, true);
                walkAnim.syncWith(null);
                console.log(walkRange, walkAnim);
            }
        });
    }
}
