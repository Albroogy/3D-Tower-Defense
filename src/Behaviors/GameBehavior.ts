import { allPressedKeys, KEYS } from "../Gobal";
import UpdateableBehavior from "../UpdateableBehavior";
import UpdateableNode from "../UpdateableNode";
import { CardHandBehavior } from "./CardHandBehavior";
import StateMachineBehavior from "./StateMachineBehavior";


export enum GameState {
    Playing = "playing",
    PlacingTowers = "PlacingTowers"
}
export let gameState: GameState = GameState.Playing;

export default class GameBehavior extends UpdateableBehavior {
    public static COMPONENT_ID: string = "Game";

    public attach(target: UpdateableNode): void {
        this._node = target;
        const stateMachineBehavior = this._node.getBehaviorByName("StateMachine") as StateMachineBehavior<GameState>;
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
    const cardHandBehavior = currentObject.getBehaviorByName("CardHand") as CardHandBehavior;
    cardHandBehavior.showAllCards();
    console.log(GameState.PlacingTowers);
}
export const onPlacingTowersUpdate = (): GameState | undefined => {
    if (allPressedKeys[KEYS.Escape]){
        return GameState.Playing;
    }
}
export const onPlacingTowersDeactivation = (currentObject: UpdateableNode) => {
    const cardHandBehavior = currentObject.getBehaviorByName("StateMachine") as CardHandBehavior;
    cardHandBehavior.hideAllCards();
}
