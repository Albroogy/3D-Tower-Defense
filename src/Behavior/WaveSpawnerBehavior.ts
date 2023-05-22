import { Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import EnemyBehavior from "./EnemyBehavior";
import { BehaviorName, ElementColor, ElementMaterial as ElementMaterial, ElementType, objects, OFFSET, Tag } from "../Gobal";
import { TagBehavior } from "./TagBehavior";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";
import HealthBarBehavior, { HealthBar } from "./HealthBarBehavior";


export enum EnemyType {
    Sphere = "Sphere",
    Cube = "Cube",
    Cylinder = "Cylinder",
    Torus = "Torus",
    Plane = "Plane",
    TorusKnot = "TorusKnot",
    Disc = "Disc",
  }

type Parameters = Record<string, any>;

const createEnemyMesh = {
    [EnemyType.Sphere]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateSphere(name, parameters, scene),
    [EnemyType.Cube]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateBox(name, parameters, scene),
    [EnemyType.Cylinder]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateCylinder(name, parameters, scene),
    [EnemyType.Torus]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateTorus(name, parameters, scene),
    [EnemyType.TorusKnot]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateTorusKnot(name, parameters, scene),
    [EnemyType.Disc]: (name: string, parameters: Parameters, scene: Scene) => MeshBuilder.CreateDisc(name, parameters, scene)
};

export type SpawnInfo = {
    parameters: Parameters,
    type: EnemyType,
    health: number,
    element: ElementType
}

export default class WaveSpawner extends UpdateableBehavior {
    public name = BehaviorName.WaveSpawner;

    private _timerId: any;
    private _enemiesCount: number = 0; // keep track of the number of enemies
    private _enemiesInWave: number = 0; // keep track of the number of enemies

    public interval: number = 1;
    public waveInfo: Array<Array<SpawnInfo>>;
    
    public currentWave: number = 0;

    public attach(spawner: TransformNode): void {
        this.spawnWave(spawner);
    }

    public spawnWave(spawner: TransformNode): void {
        let enemyIndex = 0;
        this._timerId = setInterval(() => {
            if (enemyIndex < this.waveInfo[this.currentWave].length) {
                // spawn the enemy and increase the counter
                const enemyInfo = this.waveInfo[this.currentWave][enemyIndex];
                let enemyContainerNode = new UpdateableNode("enemy", spawner.getScene());
                let mesh: Mesh;
                if (typeof createEnemyMesh[enemyInfo.type] === 'function') {
                    console.log(createEnemyMesh[enemyInfo.type])
                    mesh = createEnemyMesh[enemyInfo.type]("enemyMesh", enemyInfo.parameters, spawner.getScene());
                }
                else {
                    mesh = createEnemyMesh[EnemyType.Cube]("enemyMesh", enemyInfo.parameters, spawner.getScene());
                }

                mesh.material = ElementMaterial[enemyInfo.element];

                mesh.setParent(enemyContainerNode);
                mesh.setPositionWithLocalVector(Vector3.Zero());
                enemyContainerNode.setParent(spawner);
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
                enemyIndex++;
            } else {
                clearInterval(this._timerId);
                this.currentWave++;
                if (this.currentWave < this.waveInfo.length - OFFSET) {
                    this.spawnWave(spawner);
                }
                // const curriedSpawnWave = this.spawnWave.bind(spawner);
                // setTimeout(curriedSpawnWave, 3000);
            }
        }, this.interval * 1000);
    }
}
