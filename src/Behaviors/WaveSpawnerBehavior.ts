import { MeshBuilder, Scene, Vector3, Vector4 } from "@babylonjs/core";
import EnemyBehavior from "./EnemyBehavior";
import { BehaviorName, ElementMaterial as ElementMaterial, ElementType, IN_GAME_SECOND, objects, OFFSET, Tag, TimerMode } from "../Global";
import { TagBehavior } from "./TagBehavior";
import UpdateableBehavior from "../BabylonUpdateable/UpdateableBehavior";
import UpdateableNode from "../BabylonUpdateable/UpdateableNode";
import HealthBarBehavior, { HealthBar } from "./HealthBarBehavior";
import { TimerBehavior } from "./TimerBehavior";
import WaypointMovementBehavior from "./WayPointMovementBehavior";
import { SkeletonBehavior } from "./SkeletonBehavior";


export enum EnemyType {
    Sphere = "Sphere",
    Cube = "Cube",
    Cylinder = "Cylinder",
    Torus = "Torus",
    TorusKnot = "TorusKnot",
}

// TODO: Move to a separate file because this is just for babylon helpers
type BabylonSphereParameters = {
    segments?: number;
    diameter?: number;
    diameterX?: number;
    diameterY?: number;
    diameterZ?: number;
    arc?: number;
    slice?: number;
    sideOrientation?: number;
    frontUVs?: Vector4;
    backUVs?: Vector4;
    updatable?: boolean;
};
type BabylonCubeParameters = {};

// TODO: Redo to be type-safe
// type Parameters = BabylonSphereParameters | BabylonCubeParameters  | 
type Parameters = Record<string, any>;

const createEnemyMesh = {
    [EnemyType.Sphere]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateSphere(name, parameters, scene),
    [EnemyType.Cube]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateBox(name, parameters, scene),
    [EnemyType.Cylinder]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateCylinder(name, parameters, scene),
    [EnemyType.Torus]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateTorus(name, parameters, scene),
    [EnemyType.TorusKnot]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateTorusKnot(name, parameters, scene),
};

export type SpawnInfo = {
    parameters: Parameters,
    type: EnemyType,
    health: number,
    element: ElementType
}

export default class WaveSpawner extends UpdateableBehavior {
    public name = BehaviorName.WaveSpawner;

    private _enemiesInWave: number = 0; // keep track of the number of enemies

    public interval: number;
    public waveInfo: Array<Array<SpawnInfo>>;
    private _waypoints: Vector3[];
    
    public currentWave: number = 0;
    private _enemyIndex: number;

    constructor(waypoints: Vector3[], interval: number = 1) {
        super();
        this._waypoints = waypoints;
        this.interval = interval;
    }

    public attach(node: UpdateableNode): void {
        this._node = node;
        this.spawnWave();
    }

    public spawnWave(): void {
        this._enemyIndex = 0;
        const timerBehavior = this._node.getBehaviorByName(BehaviorName.Timer) as TimerBehavior;
        timerBehavior.start(() => this.spawnEnemy(), this.interval * IN_GAME_SECOND, TimerMode.Interval);
        this._enemiesInWave = this.waveInfo[this.currentWave].length;
    }    

    public spawnEnemy() {
        if (this._enemyIndex < this.waveInfo[this.currentWave].length) {
            // spawn the enemy and increase the counter
            const enemyInfo = this.waveInfo[this.currentWave][this._enemyIndex];
            let enemyContainerNode = new UpdateableNode(`enemy ${ElementType[enemyInfo.element]}`, this._node.getScene());
            const materialToUse = ElementMaterial[ElementType[enemyInfo.element]];

            enemyContainerNode.setParent(this._node);
            
            // Setting the parent resets the position of the child to the transwformed position
            enemyContainerNode.setPositionWithLocalVector(Vector3.Zero());
            const enemyBehavior = new EnemyBehavior(3, enemyInfo.element, enemyInfo.health);
            const tagBehavior = new TagBehavior([Tag.Enemy]);
            const waypointMovementBehavior = new WaypointMovementBehavior(this._waypoints, 10);      
            const healthBar = new HealthBar(enemyInfo.health, "red", 100, 10, true);
            const healthBarBehavior = new HealthBarBehavior([healthBar]);
            const skeletonBehavior = new SkeletonBehavior(`SkeletalMesh ${ElementType[enemyInfo.element]}`, materialToUse)

            enemyContainerNode.addBehavior(enemyBehavior);
            enemyContainerNode.addBehavior(tagBehavior);
            enemyContainerNode.addBehavior(healthBarBehavior);
            enemyContainerNode.addBehavior(waypointMovementBehavior);
            enemyContainerNode.addBehavior(skeletonBehavior);

            objects.push(enemyContainerNode);
            this._enemyIndex++;
        } else {
            const timerBehavior = this._node.getBehaviorByName(BehaviorName.Timer) as TimerBehavior;
            timerBehavior.stop();
            this.currentWave++;
            if (this.currentWave < this.waveInfo.length - OFFSET) {
                const delayBetweenWaves = 3 * IN_GAME_SECOND;

                timerBehavior.start(() => this.spawnWave(), delayBetweenWaves, TimerMode.Timeout);
            }
        }
    }
    public get enemiesInwave(): number {
        return this._enemiesInWave;
    }
}
