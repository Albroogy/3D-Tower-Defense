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
        this._node.position = this._waypoints[0];
    }

    update(dt: number): void {
        const currentWaypoint = this._waypoints[this._currentWaypointIndex];
        const direction = currentWaypoint.subtract(this._node.position).normalize();
        const distanceToWaypoint = currentWaypoint.subtract(this._node.position).length();

        if (!currentWaypoint) {
            return;
        }
        
        // Calculate the speed based on distance
        // const speedFactor = Math.max(0, Math.min(1, distanceToWaypoint / 10)); // Adjust 10 as needed
        const adjustedSpeed = this._speed;
      
        if (distanceToWaypoint <= adjustedSpeed * dt) {
            // Reached the waypoint, move to the next one
            this._currentWaypointIndex++;
        // if (this._currentWaypointIndex >= this._waypoints.length) {
        //     // Reached the last waypoint, reset to the first one
        //     this._currentWaypointIndex = 0;
        // }
        } else {
            // Move towards the current waypoint with adjusted speed
            this._node.position.addInPlace(direction.scale(adjustedSpeed * dt));
        }
        console.log(this._node.position)
    }
}
