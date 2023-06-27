import { Curve3, Mesh, Quaternion, TransformNode, Vector3 } from "@babylonjs/core";
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
        const curve = Curve3.CreateCatmullRomSpline(waypoints, 4, false);
        this._waypoints = curve.getPoints();
        this._speed = speed;
    }

    public attach(target: UpdateableNode): void {
        this._node = target;
    }

    update(dt: number): void {
        if (this._currentWaypointIndex >= this._waypoints.length || this._node == null) {
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
            this._node.lookAt(this._node.position.add(direction));
            this._node.position.addInPlace(this._node.forward.scale(adjustedSpeed));
        }
    }
}
