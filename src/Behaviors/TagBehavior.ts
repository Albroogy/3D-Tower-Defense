import { BehaviorName, Tag } from "../Gobal";
import UpdateableBehavior from "../UpdateableBehavior";

export class TagBehavior extends UpdateableBehavior {
    public name = BehaviorName.Tag;
  
    private _tags: Set<Tag>;
  
    constructor(tags: Array<Tag>) {
        super();
        this._tags = new Set(tags);
    }
  
    public hasTag(tag: Tag): boolean {
        return this._tags.has(tag);
    }
  
    public addTag(tag: Tag): void {
        this._tags.add(tag);
    }
  
    public removeTag(tag: Tag): void {
        this._tags.delete(tag);
    }
  
    public get tags(): Tag[] {
        return Array.from(this._tags);
    }
}