import Ship, { createShip } from "../models/ship";
import { Stage1 } from "./stage1";

export class Stage4 extends Stage1 {

    override id: number = 4;
    override name: string = 'Stage 4';
    override description: string = 'Neues feindliches Schiff das mehrere Treffer aushält.';
    override enemyMoveEvery: number = 2; // nur bei jedem x. Aufruf das feindliche Schiff bewegen

    override createEnemyShip(positionX: number, positionY: number): void {
        this.enemyShip = createShip(positionX, positionY, '/enemy-ship-2.png', () => {}, 3);
    }

}

