import { allPressedKeys, BehaviorName, IN_GAME_SECOND, KEYS } from "../Global";
import UpdateableBehavior from "../BabylonUpdateable/UpdateableBehavior";
import UpdateableNode from "../BabylonUpdateable/UpdateableNode";
import StateMachineBehavior from "./StateMachineBehavior";
import { ActionRunner, Blackboard, ConditionRunner, DecisionTree, NonTerminalDecisionTreeNode, TerminalDecisionTreeNode } from "./DecisionTreeBehaviour";

export enum GiantState {
    Walking = "Walking",
    Attacking = "Attacking"
}
export let gameState: GiantState = GiantState.Walking;

export default class GiantEnemyBehavior extends UpdateableBehavior {
    public static COMPONENT_ID: string = BehaviorName.GiantEnemy;

    public timeElapsedInState: number = 0;

    public attach(target: UpdateableNode): void {
        this._node = target;
        const stateMachineBehavior = this._node.getBehaviorByName(BehaviorName.StateMachine) as StateMachineBehavior<GiantState>;
        // Add states here
        stateMachineBehavior.activate(gameState);
    }
}

// Adding the states for giantEnemy

export const onWalkingActivation = () => {
    gameState = GiantState.Walking;
    console.log(GiantState.Walking)
}
export const onWalkingUpdate = (): GiantState | undefined => {
    tree.evaluate(board)(board);
    if (gameState == GiantState.Attacking) {
        return GiantState.Attacking;
    }
}
export const onWalkingDeactivation = () => {
}

export const onAttackingActivation = () => {
    console.log(GiantState.Attacking)
}
export const onAttackingUpdate = (): GiantState | undefined => {
    tree.evaluate(board)(board);
    if (gameState == GiantState.Walking) {
        return GiantState.Walking;
    }
}
export const onAttackingDeactivation = () => {
}

const CheckSmallWaveIndex: ConditionRunner = (board: Blackboard) => inRangeOfTower() == true;
const arrivedNextToTower: ActionRunner = (boardv: Blackboard) => gameState = GiantState.Attacking;

const root = new NonTerminalDecisionTreeNode();
const actionNode1 = new TerminalDecisionTreeNode();
actionNode1.action = arrivedNextToTower;

root.children = [actionNode1];
root.childrenCondition = [CheckSmallWaveIndex];

const tree = new DecisionTree();
tree.root = root;
const board: Blackboard = {};

function inRangeOfTower() {
    return true;
    // TODO: Check if in range of tower.
}