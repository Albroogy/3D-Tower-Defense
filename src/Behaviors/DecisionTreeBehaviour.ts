import UpdateableBehavior from "../BabylonUpdateable/UpdateableBehavior";
import { BehaviorName } from "../Global";

export type Blackboard = Record<string, any>;

export type ActionRunner = (board: Blackboard) => void;
export type UpdateRunner = (board: Blackboard) => void;
export type ConditionRunner = (board: Blackboard) => boolean;

export class TerminalDecisionTreeNode {
    public action: ActionRunner;
    
    public evaluate(blackboard: Blackboard): DecisionTreeNode[] {
        return [this];
    }
}

type DecisionTreeNode = TerminalDecisionTreeNode | NonTerminalDecisionTreeNode;
export class NonTerminalDecisionTreeNode {
    public children: Array<DecisionTreeNode> = [];
    public childrenCondition: Array<ConditionRunner> = [];
    public updaters: Array<UpdateRunner> = [];
    
    public evaluate(blackboard: Blackboard): DecisionTreeNode[] {
        this.updaters.forEach(u => u(blackboard));

        let childrenToBeEvaluated = this.children.filter((node: DecisionTreeNode, index: number) => {
            return this.childrenCondition[index](blackboard);
        });

        return childrenToBeEvaluated.flatMap(node => node.evaluate(blackboard));
    }
}

export class DecisionTree {
    public root: DecisionTreeNode;

    public evaluate(blackboard: Blackboard): ActionRunner|null {
        let chosenNodes: DecisionTreeNode[] = this.root.evaluate(blackboard);
        if (chosenNodes.length == 1 && chosenNodes[0].constructor == TerminalDecisionTreeNode) {
            return (chosenNodes[0] as TerminalDecisionTreeNode).action;
        }
        return null;
    }
}

export class DecisionTreeBehaviour extends UpdateableBehavior {
    public name = BehaviorName.DecisionTree;

    
}
