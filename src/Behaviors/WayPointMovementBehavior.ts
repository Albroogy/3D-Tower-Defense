import { Mesh, TransformNode, Vector3 } from "@babylonjs/core";
import { BehaviorName, ElementType } from "../Global";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export default class WaypointMovementBehavior extends UpdateableBehavior {
    public name = BehaviorName.WaypointMovement;
    private _waypoints: Vector3[] = [];
    private _currentWaypointIndex: number = 0;
    private _speed: number;

    constructor(waypoints: Vector3[], speed: number) {
        super();
        this._waypoints = waypoints;
        this._speed = speed;
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }

    update(dt: number): void {
        if (this._currentWaypointIndex >= this._waypoints.length) {
            return;
        }
    
        const currentWaypoint = this._waypoints[this._currentWaypointIndex];
        const direction = currentWaypoint.subtract(this._node.position).normalize();
        const distanceToWaypoint = currentWaypoint.subtract(this._node.position).length();
    
        if (!currentWaypoint) {
            return;
        }
        
        const adjustedSpeed = this._speed * dt;
      
        if (distanceToWaypoint <= adjustedSpeed) {
            // Reached the waypoint, move to the next one
            this._node.position.copyFrom(currentWaypoint);
            this._currentWaypointIndex++;
        } else {
            // Move towards the current waypoint with adjusted speed
            const movement = direction.scale(adjustedSpeed);
            this._node.position.addInPlace(movement);
        }
        
        //console.log(this._currentWaypointIndex);
        //console.log(this._node.position);
    }
}
