import { Mesh, MeshBuilder, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";
import EnemyBehavior from "./EnemyBehavior";
import UpdateableBehavior from "./UpdateableBehavior";
import UpdateableNode from "./UpdateableNode";

export enum EnemyType {
    SphereEnemy,
    CubeEnemy,
}

export type SpawnInfo = {
    parameters: Record<string, any>,
    material: StandardMaterial | null,
    type: EnemyType
}

export default class WaveSpawner extends UpdateableBehavior {
    private _timerId: any;
    private _enemiesCount: number = 0; // keep track of the number of enemies
    private _enemiesInWave: number = 0; // keep track of the number of enemies

    public interval: number;
    public enemies: Array<SpawnInfo>;

    public attach(spawner: TransformNode): void {
        const position = spawner.position;
        let enemyIndex = 0;
        this._timerId = setInterval(() => {
            if (enemyIndex < this.enemies.length) {
                // spawn the enemy and increase the counter
                const enemyInfo = this.enemies[enemyIndex];
                let enemyContainerNode = new UpdateableNode("enemy", spawner.getScene());
                let mesh: Mesh;
                if (enemyInfo.type == EnemyType.SphereEnemy) {
                    mesh = MeshBuilder.CreateSphere("sphere", enemyInfo.parameters, spawner.getScene());
                }
                else if (enemyInfo.type == EnemyType.CubeEnemy) {
                    mesh = MeshBuilder.CreateBox("square", enemyInfo.parameters, spawner.getScene());
                }
                if (enemyInfo.material) {
                    mesh.material = enemyInfo.material;
                }
                mesh.setParent(enemyContainerNode);
                enemyContainerNode.setParent(spawner);
                // Setting the parent resets the position of the child to the transwformed position
                enemyContainerNode.setPositionWithLocalVector(Vector3.Zero());
                const enemyBehavior = new EnemyBehavior(1);
                enemyContainerNode.addBehavior(enemyBehavior);
                enemyIndex++;
            } else {
                clearInterval(this._timerId);
            }
        }, this.interval * 1000);
    }
}
