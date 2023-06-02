import { Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import EnemyBehavior from "./EnemyBehavior";
import { BehaviorName, ElementColor, ElementMaterial as ElementMaterial, ElementType, IN_GAME_SECOND, objects, OFFSET, Tag, TimerMode } from "../Gobal";
import { TagBehavior } from "./TagBehavior";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";
import HealthBarBehavior, { HealthBar } from "./HealthBarBehavior";
import { TimerBehavior } from "./TimerBehavior";


export enum EnemyType {
    Sphere = "Sphere",
    Cube = "Cube",
    Cylinder = "Cylinder",
    Torus = "Torus",
    TorusKnot = "TorusKnot",
}

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

    private _enemiesCount: number = 0; // keep track of the number of enemies
    private _enemiesInWave: number = 0; // keep track of the number of enemies

    public interval: number = 1;
    public waveInfo: Array<Array<SpawnInfo>>;
    
    public currentWave: number = 0;
    private _enemyIndex: number;

    public attach(node: UpdateableNode): void {
        this._node = node;
        this.spawnWave();
    }

    public spawnWave(): void {
        this._enemyIndex = 0;
        const timerBehavior = this._node.getBehaviorByName(BehaviorName.Timer) as TimerBehavior;
        timerBehavior.start(() => this.spawnEnemy(), this.interval * IN_GAME_SECOND, TimerMode.Interval);
    }    

    public spawnEnemy() {
        if (this._enemyIndex < this.waveInfo[this.currentWave].length) {
            // spawn the enemy and increase the counter
            const enemyInfo = this.waveInfo[this.currentWave][this._enemyIndex];
            let enemyContainerNode = new UpdateableNode(`enemy ${enemyInfo.parameters}`, this._node.getScene());
            let mesh: Mesh;

            mesh = createEnemyMesh[enemyInfo.type]("enemyMesh", enemyInfo.parameters, this._node.getScene());

            mesh.material = ElementMaterial[enemyInfo.element];

            mesh.setParent(enemyContainerNode);
            mesh.setPositionWithLocalVector(Vector3.Zero());
            enemyContainerNode.setParent(this._node);
            // Setting the parent resets the position of the child to the transwformed position
            enemyContainerNode.setPositionWithLocalVector(Vector3.Zero());
            const enemyBehavior = new EnemyBehavior(3, enemyInfo.element, enemyInfo.health);
            const tagBehavior = new TagBehavior([Tag.Enemy]);
            
            const healthBar = new HealthBar(Vector3.Zero(), enemyInfo.health, "red", 100, 10, true);
            const healthBarBehavior = new HealthBarBehavior([healthBar]);
            enemyContainerNode.addBehavior(enemyBehavior);
            enemyContainerNode.addBehavior(tagBehavior);
            enemyContainerNode.addBehavior(healthBarBehavior);
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
}
