function level1() {
    const waves: Array<Array<SpawnInfo>> = [
    ]

    let waveSize = 0;

    for (let i = 0; i < 100; i++) {
        waveSize += 3;

        const wave = generateRandomWave(waveSize, i);

        waves.push(wave);
    }

    console.log(waves)

    const spawner2 = new UpdateableNode("waveSpawner", scene);
    spawner2.position.x = -20;
    const spawnerBehavior = new WaveSpawnerBehavior();
    spawnerBehavior.waveInfo = waves;
    spawner2.addBehavior(spawnerBehavior);

    const tower = new UpdateableNode("tower1", scene);
    tower.position.y = 1.25;
    tower.position.x = -10;
    tower.position.z = 10;
    const towerBehavior = new TowerBehavior(2.5, 100, ElementType.Fire);
    const tagBehavior = new TagBehavior([Tag.Tower]);
    tower.addBehavior(towerBehavior);
    tower.addBehavior(tagBehavior);


    const tower2 = new UpdateableNode("tower2", scene);
    tower2.position.y = 1.25;
    tower2.position.x = 10;
    tower2.position.z = 10;
    const towerBehavior2 = new TowerBehavior(2.5, 100, ElementType.Water);
    const tagBehavior2 = new TagBehavior([Tag.Tower]);
    tower2.addBehavior(towerBehavior2);
    tower2.addBehavior(tagBehavior2);

    
    const tower3 = new UpdateableNode("tower3", scene);
    tower3.position.y = 1.25;
    tower3.position.x = 10;
    tower3.position.z = -10;
    tower3.addBehavior(new TowerBehavior(2.5, 100, ElementType.Air));
    tower3.addBehavior(new TagBehavior([Tag.Tower]));
    
    const tower4 = new UpdateableNode("tower4", scene);
    tower4.position.y = 1.25;
    tower4.position.x = -10;
    tower4.position.z = -10;
    tower4.addBehavior(new TowerBehavior(2.5, 100, ElementType.Earth));
    tower4.addBehavior(new TagBehavior([Tag.Tower]));

    objects.push(tower);
    objects.push(tower2);
    objects.push(tower3);
    objects.push(tower4);
}