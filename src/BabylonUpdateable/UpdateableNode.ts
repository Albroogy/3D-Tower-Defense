import { TransformNode, Scene } from "@babylonjs/core";
import UpdateableBehavior from "./UpdateableBehavior";
import UpdateableNodeManager from "./UpdateableNodeManager";


export default class UpdateableNode extends TransformNode {
    constructor(name: string, scene: Scene) {
        super(name, scene);
        UpdateableNodeManager.instance.addNode(this);
    }
    public update(dt: number) {
        for (const behaviour of this.behaviors) {
            (behaviour as any as UpdateableBehavior).update(dt);
        }
    }

    public dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void {
        UpdateableNodeManager.instance.removeNode(this);

        super.dispose(doNotRecurse, disposeMaterialAndTextures);
    }
}