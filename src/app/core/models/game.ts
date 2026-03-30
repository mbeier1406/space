import { Stage } from "../stages/stages";
import { Stage1 } from "../stages/stage1";

/**
 * Speichert die Stages
 */
export const stages : Record<number, Stage> = {
    1: new Stage1(),
};

/**
 * Diese Datenstruktur speichert den aktuellen Spielstand
 */
export interface Game {
    currentStageNumber: number;
    currentStage: Stage;
    gameState: GameState;
}

/**
 * Zustand des Spiels
 */
export enum GameState {
    Running = 'RUNNING',
    GameOver = 'GAME_OVER',
    NextStage = 'NEXT_STAGE',
    Paused = 'PAUSED',
}

/**
 * Speichert den aktuellen Spielstand
 */
export let game: Game = {
    currentStageNumber: 1,
    currentStage: stages[1],
    gameState: GameState.Running,
};

