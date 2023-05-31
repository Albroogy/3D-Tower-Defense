import { Behavior, TransformNode } from "@babylonjs/core";
import UpdateableNode from "./UpdateableNode";

export default class UpdateableBehavior implements Behavior<TransformNode> {
    public name: string;

    protected _node: UpdateableNode | null;
    
    public init(): void {

    }
    public attach(target: UpdateableNode): void {

    }
    public detach(): void {

    }
    public update(dt: number): void {

    }
}