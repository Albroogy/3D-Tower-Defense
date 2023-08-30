import UpdateableNode from "./UpdateableNode";

export default class UpdateableNodeManager {
    private _nodes: UpdateableNode[] = [];

    public addNode(node: UpdateableNode): void {
        this._nodes.push(node);
    }

    public removeNode(node: UpdateableNode): void {
        const index = this._nodes.indexOf(node);
        const lastIndex = this._nodes.length - 1;
        this._nodes[index] = this._nodes[lastIndex];
        this._nodes.pop();
    }

    public update(dt: number) {
        for (const n of this._nodes) {
            n.update(dt);
        }
    }

    public static instance: UpdateableNodeManager = new UpdateableNodeManager();
}
