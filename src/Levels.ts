import { Vector3 } from "@babylonjs/core";
import { gameSystem } from "./app";
import { TagBehavior } from "./Behaviors/TagBehavior";
import { TimerBehavior } from "./Behaviors/TimerBehavior";
import TowerBehavior from "./Behaviors/TowerBehaviour";
import WaveSpawnerBehavior, { SpawnInfo } from "./Behaviors/WaveSpawnerBehavior";
import { ElementType, objects, scene, Tag } from "./Global";
import UpdateableNode from "./UpdateableNode";
import { generateRandomWave, generateTestingWave } from "./waveData";

export function level1() {
    const waves: Array<Array<SpawnInfo>> = [
    ]

    let waveSize = 3;

    for (let i = 0; i < 100; i++) {
        const wave = generateRandomWave(waveSize, i);

        waves.push(wave);

        waveSize += 1;
    }

    console.log(waves)

    const spawner = new UpdateableNode("WaveSpawner", scene);
    spawner.position.x = -20;
    const spawnerBehavior = new WaveSpawnerBehavior([new Vector3(15, 0, 0), new Vector3(15, 0, 5), new Vector3(10, 0, 10), new Vector3(5, 0, 10), new Vector3(0, 0, 10), new Vector3(0, 0, 0)]);
    spawnerBehavior.waveInfo = waves;
    const spawnerTimerBehavior = new TimerBehavior();
    spawner.addBehavior(spawnerTimerBehavior);
    spawner.addBehavior(spawnerBehavior);
    spawner.parent = gameSystem;

    const tower = new UpdateableNode("tower1", scene);
    tower.position.y = 1.25;
    tower.position.x = -10;
    tower.position.z = 10;
    const towerBehavior = new TowerBehavior(2.5, 100, ElementType.Fire);
    const timerBehavior = new TimerBehavior();
    const tagBehavior = new TagBehavior([Tag.Tower]);
    tower.addBehavior(timerBehavior);
    tower.addBehavior(towerBehavior);
    tower.addBehavior(tagBehavior);


    const tower2 = new UpdateableNode("tower2", scene);
    tower2.position.y = 1.25;
    tower2.position.x = 10;
    tower2.position.z = 10;
    const towerBehavior2 = new TowerBehavior(2.5, 100, ElementType.Water);
    const timerBehavior2 = new TimerBehavior();
    const tagBehavior2 = new TagBehavior([Tag.Tower]);
    tower2.addBehavior(timerBehavior2);
    tower2.addBehavior(towerBehavior2);
    tower2.addBehavior(tagBehavior2);

    
    const tower3 = new UpdateableNode("tower3", scene);
    tower3.position.y = 1.25;
    tower3.position.x = 10;
    tower3.position.z = -10;
    const timerBehavior3 = new TimerBehavior();
    tower3.addBehavior(timerBehavior3);
    tower3.addBehavior(new TowerBehavior(2.5, 100, ElementType.Air));
    tower3.addBehavior(new TagBehavior([Tag.Tower]));
    
    const tower4 = new UpdateableNode("tower4", scene);
    tower4.position.y = 1.25;
    tower4.position.x = -10;
    tower4.position.z = -10;
    const timerBehavior4 = new TimerBehavior();
    tower4.addBehavior(timerBehavior4);
    tower4.addBehavior(new TowerBehavior(2.5, 100, ElementType.Earth));
    tower4.addBehavior(new TagBehavior([Tag.Tower]));

    objects.push(tower);
    objects.push(tower2);
    objects.push(tower3);
    objects.push(tower4);
}

export function testingLevel() {
    const waves: Array<Array<SpawnInfo>> = [];

    const waveSize = 5;

    for (let i = 0; i < 100; i++) {
        const wave = generateTestingWave(waveSize);

        waves.push(wave);
    }

    console.log(waves);

    const spawner = new UpdateableNode("WaveSpawner", scene);
    spawner.position.x = -20;
    const spawnerBehavior = new WaveSpawnerBehavior([new Vector3(-15, 0, 0), new Vector3(-15, 0, 5), new Vector3(-10, 0, 10), new Vector3(-5, 0, 10), new Vector3(0, 0, 10), new Vector3(10, 0, 0)]);
    spawnerBehavior.waveInfo = waves;
    const spawnerTimerBehavior = new TimerBehavior();
    spawner.addBehavior(spawnerTimerBehavior);
    spawner.addBehavior(spawnerBehavior);
    spawner.parent = gameSystem;

    const waterTower = new UpdateableNode("waterTower", scene);
    waterTower.position.x = 5;
    waterTower.position.y = 1.25;
    const waterTowerBehavior = new TowerBehavior(2.5, 100, ElementType.Water);
    const waterTowerTagBehavior = new TagBehavior([Tag.Tower]);
    const timerBehavior = new TimerBehavior();
    waterTower.addBehavior(timerBehavior);
    waterTower.addBehavior(waterTowerBehavior);
    waterTower.addBehavior(waterTowerTagBehavior);

    objects.push(waterTower);
}