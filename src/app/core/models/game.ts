import { Stage } from "../stages/stages";
import { Stage1 } from "../stages/stage1";
import { Stage2 } from "../stages/stage2";

/**
 * Speichert die Stages
 */
export const stages : Record<number, Stage> = {
    1: new Stage1(),
    2: new Stage2()
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
    Reset = 'RESET', // Spiel wird zurückgesetzt
    Intro = 'INTRO', // Stage startet, Spieler sieht den Intro-Text
    Running = 'RUNNING',
    GameOver = 'GAME_OVER', // Spieler verliert
    NextStage = 'NEXT_STAGE', // Spieler gewinnt und geht zur nächsten Stage
    Finished = 'FINISHED' // Spieler hat alle Stages durchgespielt
}

/**
 * Speichert den aktuellen Spielstand
 */
export let game: Game = {
    currentStageNumber: 1,
    currentStage: stages[1],
    gameState: GameState.Intro,
};

export function resetGame(): void {
    game.currentStageNumber = 1;
    game.currentStage = stages[1];
    game.gameState = GameState.Intro;
}
