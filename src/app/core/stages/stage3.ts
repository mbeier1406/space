import { Stage1 } from "./stage1";
import Ship from "../models/ship";

export class Stage2 extends Stage1 {
    override id: number = 3;
    override name: string = 'Stage 3';
    override description: string = 'Zwei gegnerische Schiffe.';
    override enemyMoveEvery: number = 3; // nur bei jedem x. Aufruf das feindliche Schiff bewegen

    enemyShips: Ship[] = [];

}
