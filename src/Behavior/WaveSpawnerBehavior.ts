import { Mesh, MeshBuilder, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import EnemyBehavior from "./EnemyBehavior";
import { BehaviorName, ElementColor, ElementType, objects, OFFSET, Tag } from "../Gobal";
import { TagBehavior } from "./TagBehavior";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";

export enum EnemyType {
    SphereEnemy,
    CubeEnemy,
}

export type SpawnInfo = {
    parameters: Record<string, any>,
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
                if (enemyInfo.type == EnemyType.SphereEnemy) {
                    mesh = MeshBuilder.CreateSphere("sphere", enemyInfo.parameters, spawner.getScene());
                }
                else if (enemyInfo.type == EnemyType.CubeEnemy) {
                    mesh = MeshBuilder.CreateBox("square", enemyInfo.parameters, spawner.getScene());
                }
                const enemyMaterial = new StandardMaterial("enemyMaterial", spawner.getScene());
                enemyMaterial.diffuseColor = ElementColor[enemyInfo.element];

                mesh.material = enemyMaterial;

                mesh.setParent(enemyContainerNode);
                mesh.setPositionWithLocalVector(Vector3.Zero());
                enemyContainerNode.setParent(spawner);
                // Setting the parent resets the position of the child to the transwformed position
                enemyContainerNode.setPositionWithLocalVector(Vector3.Zero());
                const enemyBehavior = new EnemyBehavior(3, enemyInfo.element, enemyInfo.health);
                const tagBehavior = new TagBehavior([Tag.Enemy]);
                enemyContainerNode.addBehavior(enemyBehavior);
                enemyContainerNode.addBehavior(tagBehavior);
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
