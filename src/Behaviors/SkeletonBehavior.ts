import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Scene } from "@babylonjs/core/scene";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";
import { BehaviorName } from "../Global";

export class SkeletonBehavior extends UpdateableBehavior {
    public name = BehaviorName.Skeleton;

    private _mesh: AbstractMesh;
    private _scene: Scene;

    constructor(scene: Scene) {
    super();
    this._scene = scene;

    // Import the skeleton and associated animations
    SceneLoader.ImportMesh("", "./assets/meshes/", "dummy3.babylon", this._scene, (newMeshes, particleSystems, skeletons) => {
        const skeletalMesh = newMeshes[0];
        const skeleton = skeletons[0];

        // Set the parent of the skeletal mesh
        skeletalMesh.position.copyFrom(this._node.position);
        skeletalMesh.parent = this._node;

        const walkRange = skeleton.getAnimationRange("YBot_Walk");

        if (walkRange) {
            const walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 1, true);
            walkAnim.syncWith(null);
            console.log(walkRange, walkAnim);
        }
    });
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }
}
