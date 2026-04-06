import { Stage1 } from "./stage1";
import { moveShip } from "../models/ship";

export class Stage2 extends Stage1 {

    override id: number = 2;
    override name: string = 'Stage 2';
    override description: string = 'Feindliches Schiff bewegt sich schneller.';
    override enemyMoveEvery: number = 3; // nur bei jedem x. Aufruf das feindliche Schiff bewegen

    public override moveEnemyShip(): void {
        this.enemyMoveTick++;
        if (this.enemyMoveTick % this.enemyMoveEvery !== 0) {
            return; // diesen Aufruf auslassen, weil es nicht die Zeit ist
        }
        if ( this.enemyShip.positionX < this.ship.positionX) {
            moveShip(this.enemyShip, 'ArrowRight', 4, this.canvasWidth);
        } else {
            moveShip(this.enemyShip, 'ArrowLeft', 4, this.canvasWidth);
        }
        this.enemyMoveTick = 0;
    }

}
