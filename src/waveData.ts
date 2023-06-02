import { EnemyType, SpawnInfo } from "./Behaviors/WaveSpawnerBehavior";
import { ElementType, getRandomEnumValue } from "./Gobal";

const enemyParameterMap = {
    [EnemyType.Sphere]: { diameter: 2 },
    [EnemyType.Cube]: { width: 2, height: 2, depth: 2 },
    [EnemyType.Cylinder]: { height: 2, diameterTop: 1, diameterBottom: 1 },
    [EnemyType.Torus]: { diameter: 3, thickness: 0.5 },
    [EnemyType.TorusKnot]: { radius: 2, tube: 0.5, radialSegments: 16, tubularSegments: 100 },
};

const waveElements = {
    0: {
        [ElementType.Fire]: 0.7,
        [ElementType.Water]: 0.3,
        [ElementType.Air]: 0,
        [ElementType.Earth]: 0,
        [ElementType.Metal]: 0
    },
    10: {
        [ElementType.Fire]: 0.6,
        [ElementType.Water]: 0.4,
        [ElementType.Air]: 0,
        [ElementType.Earth]: 0,
        [ElementType.Metal]: 0
    },
    20: {
        [ElementType.Fire]: 0.5,
        [ElementType.Water]: 0.3,
        [ElementType.Air]: 0.1,
        [ElementType.Earth]: 0.05,
        [ElementType.Metal]: 0.05
    },
    30: {
        [ElementType.Fire]: 0.4,
        [ElementType.Water]: 0.3,
        [ElementType.Air]: 0.2,
        [ElementType.Earth]: 0.05,
        [ElementType.Metal]: 0.05
    },
    40: {
        [ElementType.Fire]: 0.3,
        [ElementType.Water]: 0.2,
        [ElementType.Air]: 0.15,
        [ElementType.Earth]: 0.2,
        [ElementType.Metal]: 0.15
    },
    50: {
        [ElementType.Fire]: 0.25,
        [ElementType.Water]: 0.25,
        [ElementType.Air]: 0.25,
        [ElementType.Earth]: 0.15,
        [ElementType.Metal]: 0.1
    },
    60: {
        [ElementType.Fire]: 0.2,
        [ElementType.Water]: 0.2,
        [ElementType.Air]: 0.1,
        [ElementType.Earth]: 0.15,
        [ElementType.Metal]: 0.35
    },
    70: {
        [ElementType.Fire]: 0.1,
        [ElementType.Water]: 0.1,
        [ElementType.Air]: 0.3,
        [ElementType.Earth]: 0.25,
        [ElementType.Metal]: 0.25
    },
    80: {
        [ElementType.Fire]: 0.1,
        [ElementType.Water]: 0.25,
        [ElementType.Air]: 0.25,
        [ElementType.Earth]: 0.2,
        [ElementType.Metal]: 0.2
    },
    90: {
        [ElementType.Fire]: 0.2,
        [ElementType.Water]: 0.15,
        [ElementType.Air]: 0.1,
        [ElementType.Earth]: 0.35,
        [ElementType.Metal]: 0.2
    },
    100: {
        [ElementType.Fire]: 0.15,
        [ElementType.Water]: 0.15,
        [ElementType.Air]: 0.25,
        [ElementType.Earth]: 0.25,
        [ElementType.Metal]: 0.2
    }
}

export function generateRandomWave(waveLength: number, waveNumber: number): Array<SpawnInfo> {
    const wave: Array<SpawnInfo> = [];

    const elementCounts = calculateElementCounts(waveNumber, waveLength);
  
    for (let i = 1; i <= waveLength; i++) {
        const enemyType = getRandomEnumValue(EnemyType);

        let health: number;

        switch (enemyType) {
            case EnemyType.Sphere:
                health = 2;
                break;
            case EnemyType.Cube:
                health = 1;
                break;
            case EnemyType.Cylinder:
                health = 3;
                break;
            case EnemyType.Torus:
                health = 5;
                break;
            case EnemyType.TorusKnot:
                health = 15;
                break;
            default:
                health = 2;
                console.log("DEFAULT");
        }

        let element = getEnemyElement(elementCounts, i);

        // console.log(element);

        const spawnInfo: SpawnInfo = {
            parameters: enemyParameterMap[enemyType],
            type: enemyType,
            health: health,
            element: element
        };
    
        wave.push(spawnInfo);
    }
  
    return wave;
}

export function generateTestingWave(waveLength: number) {
    const wave: Array<SpawnInfo> = [];

    for (let i = 1; i <= waveLength; i++) {
        const enemyType = EnemyType.Cube;
        const health = 3;
        const element = ElementType.Air;

        const spawnInfo: SpawnInfo = {
            parameters: enemyParameterMap[enemyType],
            type: enemyType,
            health: health,
            element: element
        };

        wave.push(spawnInfo);
    }

    return wave;
}

type ElementCount = {
    elementType: string;
    elementCount: number;
};

function calculateElementCounts(waveIndex: number, totalEnemies: number): ElementCount[] {
    const waveInfoGap = 10;

    const minWave = Math.floor(waveIndex / waveInfoGap) * waveInfoGap;
    const maxWave = minWave + waveInfoGap;

    const minWaveInfo = waveElements[minWave];
    const maxWaveInfo = waveElements[maxWave];

    const min = 0;
    const max = 100;

    const maxMinDif = max - min;

    const elements = Object.keys(ElementType).filter(element => !isNaN(element as any as number));

    elements.forEach(element => ElementType[element]);

    const elementCounts = elements.map(elementType => {
        const elementPercentage = ((maxMinDif - waveIndex) * minWaveInfo[elementType] + waveIndex * maxWaveInfo[elementType]) / (maxMinDif);
        const elementCount = Math.round(totalEnemies * elementPercentage);
        return { elementType, elementCount};
    });

    return elementCounts;
}

function getEnemyElement(elementCounts: ElementCount[], enemyIndex: number): ElementType {
    let cumulativeCount = 0;
    for (const { elementType, elementCount } of elementCounts) {
        cumulativeCount += elementCount;
        if (enemyIndex < cumulativeCount) {
            return ElementType[elementType];
        }
    }
}