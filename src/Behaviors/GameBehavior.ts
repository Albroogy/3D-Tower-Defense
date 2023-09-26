import { allPressedKeys, BehaviorName, IN_GAME_SECOND, KEYS } from "../Global";
import UpdateableBehavior from "../BabylonUpdateable/UpdateableBehavior";
import UpdateableNode from "../BabylonUpdateable/UpdateableNode";
import { CardHandBehavior } from "./CardHandBehavior";
import StateMachineBehavior from "./StateMachineBehavior";


export enum GameState {
    Playing = "playing",
    PlacingTowers = "PlacingTowers"
}
export let gameState: GameState = GameState.Playing;

export default class GameBehavior extends UpdateableBehavior {
    public static COMPONENT_ID: string = BehaviorName.Game;

    public timeElapsedInState: number = 0;

    public attach(target: UpdateableNode): void {
        this._node = target;
        const stateMachineBehavior = this._node.getBehaviorByName(BehaviorName.StateMachine) as StateMachineBehavior<GameState>;
        stateMachineBehavior.stateMachine.addState(GameState.Playing, onPlayingActivation, onPlayingUpdate, onPlayingDeactivation);
        stateMachineBehavior.stateMachine.addState(GameState.PlacingTowers, onPlacingTowersActivation, onPlacingTowersUpdate, onPlacingTowersDeactivation);
        stateMachineBehavior.activate(GameState.Playing);
    }
}

// Adding the states for gameSM
export const onPlayingActivation = () => {
    gameState = GameState.Playing;
    console.log(GameState.Playing)
}
export const onPlayingUpdate = (): GameState | undefined => {
    if (allPressedKeys[KEYS.One]){
        return GameState.PlacingTowers;
    }
}
export const onPlayingDeactivation = () => {
}

export const onPlacingTowersActivation = (currentObject: UpdateableNode) => {
    gameState = GameState.PlacingTowers;
    const cardHandBehavior = currentObject.getBehaviorByName(BehaviorName.CardHand) as CardHandBehavior;
    cardHandBehavior.showAllCards();
    console.log(GameState.PlacingTowers, cardHandBehavior._cards);
    
}
export const onPlacingTowersUpdate = (deltaTime: number, currentObject: UpdateableNode): GameState | undefined => {
    // const gameBehavior = currentObject.getBehaviorByName(BehaviorName.Game) as GameBehavior;
    // console.log(gameBehavior)
    // gameBehavior.timeElapsedInState += 1;
    
    // if (allPressedKeys[KEYS.One] && gameBehavior.timeElapsedInState > IN_GAME_SECOND/2){
    //     gameBehavior.timeElapsedInState = 0;
    //     return GameState.Playing;
    // }
    if (allPressedKeys[KEYS.Escape]){
        return GameState.Playing;
    }
}
export const onPlacingTowersDeactivation = (currentObject: UpdateableNode) => {
    const cardHandBehavior = currentObject.getBehaviorByName(BehaviorName.CardHand) as CardHandBehavior;
    cardHandBehavior.hideAllCards();
}
