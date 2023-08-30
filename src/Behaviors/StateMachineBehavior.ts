import { BehaviorName } from "../Global";
import UpdateableBehavior from "../BabylonUpdateable/UpdateableBehavior";
import UpdateableNode from "../BabylonUpdateable/UpdateableNode";

type UpdateableNodeFunctor = (entity: UpdateableNode) => void;
type UpdateStateFunctor<StateEnum> = (deltaTime: number, entity: UpdateableNode) => StateEnum | undefined;

export class State<StateEnum> {
    public onActivation: UpdateableNodeFunctor;
    public update: UpdateStateFunctor<StateEnum>;
    public onDeactivation: UpdateableNodeFunctor;
    constructor(onActivation: UpdateableNodeFunctor, update: UpdateStateFunctor<StateEnum>, onDeactivation: UpdateableNodeFunctor) {
        this.onActivation = onActivation;
        this.update = update;
        this.onDeactivation = onDeactivation;
    }
}

export class StateMachine<StateEnum extends string> {
    public states: Record<StateEnum, State<StateEnum>>;
    public activeState: null | State<StateEnum>;
    public data: Record<string, number>;
    constructor() {
        this.states = {} as Record<StateEnum, State<StateEnum>>;
        this.activeState = null;
        this.data = {
            stateStart: 0,
        }
    }
    addState(stateName: StateEnum, onActivation: UpdateableNodeFunctor, update: UpdateStateFunctor<StateEnum>, onDeactivation: UpdateableNodeFunctor) {
        this.states[stateName] = new State(onActivation, update, onDeactivation);
    }
    update(deltaTime: number, currentObject: UpdateableNode) {
        if (this.activeState){
            const nextState: StateEnum | undefined = this.activeState.update(deltaTime, currentObject);
            // console.log(nextState)
            if (nextState){
                this.activeState.onDeactivation(currentObject);
                this.activeState = this.states[nextState];
                this.activeState.onActivation(currentObject);
            }
        }
    }
}

export default class StateMachineBehavior<StateEnum extends string> extends UpdateableBehavior {
    public name: string = BehaviorName.StateMachine;

    public attach(target: UpdateableNode): void {
        this._node = target;
    }
    
    public activate(initialState: StateEnum) {
        console.assert(this._node != null);
        this.stateMachine.activeState = this.stateMachine.states[initialState];
        this.stateMachine.activeState.onActivation(this._node);
    }

    public update(dt: number): void {
        if (this._node) {
            this.stateMachine.update(dt, this._node);
        }
    }

    public stateMachine: StateMachine<StateEnum> = new StateMachine<StateEnum>();
}