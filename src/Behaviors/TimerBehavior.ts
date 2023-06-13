import { BehaviorName, IN_GAME_SECOND, TimerMode } from "../Global";
import UpdateableBehavior from "../UpdateableBehavior";

export class TimerBehavior extends UpdateableBehavior {
    public name = BehaviorName.Timer;

    private _timers: TimerData[] = [];

    public start(callback: () => void, targetTime: number, mode: TimerMode): void {
        const timerData: TimerData = {
            callback,
            targetTime,
            mode,
            elapsedTime: 0,
        };

        this._timers.push(timerData);
    }

    public stop(): void {
        this._timers = [];
    }

    public reset(): void {
        for (const timer of this._timers) {
            timer.elapsedTime = 0;
        }
    }

    public update(deltaTime: number): void {
        for (const timer of this._timers) {
            timer.elapsedTime += deltaTime * IN_GAME_SECOND;

            // if (timer.mode === TimerMode.Timeout) {
            //     console.log(`Elapsed time: ${timer.elapsedTime}`, `Target time: ${timer.targetTime}`)
            // }

            if (timer.elapsedTime >= timer.targetTime) {
                timer.callback();
                timer.elapsedTime = 0;
                if (timer.mode === TimerMode.Timeout) {
                    this._timers.splice(this._timers.indexOf(timer), 1);
                }
            }
        }
    }
}

type TimerData = {
    callback: () => void;
    targetTime: number;
    mode: TimerMode;
    elapsedTime: number;
};