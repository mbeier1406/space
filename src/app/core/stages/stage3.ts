import { Block, createBlock, drawBlocks } from "../models/block";
import { BULLET_WIDTH, createBullet } from "../models/bullet";
import { Game, game, GameState } from "../models/game";
import Ship, { createShip, drawShip, moveShip, SHIP_WIDTH, ShipState, updateExplosion } from "../models/ship";
import { Stage1 } from "./stage1";
import { StageState } from "./stages";

export class Stage3 extends Stage1 {
    override id: number = 3;
    override name: string = 'Stage 3';
    override description: string = 'Zwei gegnerische Schiffe.';
    override enemyMoveEvery: number = 2; // nur bei jedem x. Aufruf das feindliche Schiff bewegen

    enemyShips: Ship[] = [];
    blocks: Block[] = [];

    override initStage(canvasWidth: number, canvasHeight: number, stdCanvasSize: number): void {
        this.stageState = StageState.Running;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.stdCanvasSize = stdCanvasSize;
        // Spieler in der Mitte unten
        this.createShip(canvasWidth / 2 - this.ship.width / 2, canvasHeight - this.ship.height, () => {});
        this.createStars(this.ship.height);
        // Zwei Gegner bei 1/3 und 2/3
        this.enemyShips = [
            createShip(canvasWidth / 3 - SHIP_WIDTH / 2, 0, '/enemy-ship.png', () => {}),
            createShip((2 * canvasWidth / 3) - SHIP_WIDTH / 2, 0, '/enemy-ship.png', () => {}),
        ];
        this.enemyShip = this.enemyShips[0]; // Kompatibilität mit Basisklasse
        this.bullets = [];
        this.enemyBullets = [];

        const blockW = 80;
        const blockH = 20;
        const midY = canvasHeight / 2 - blockH / 2;        
        this.blocks = [
            createBlock(canvasWidth / 3 - blockW / 2, midY, blockW, blockH),
            createBlock(canvasWidth / 2 - blockW / 2, midY, blockW, blockH),
            createBlock((2 * canvasWidth / 3) - blockW / 2, midY, blockW, blockH),
        ];

        game.gameState = GameState.Intro;
    }

    override playStage(): Game {

        this.moveBullets();
        this.moveEnemyShips();
        this.createEnemyBullets();
        this.moveEnemyBullets();
        updateExplosion(this.ship);
        this.enemyShips.forEach(s => updateExplosion(s));

        const bulletGroups = [this.bullets, this.enemyBullets];
        for (let i = 0; i < bulletGroups.length; i++) {
            const hits = this.collisionService.findBlockHits(bulletGroups[i], this.blocks);
            const remove = new Set<number>();        
            for (const hit of hits) {
                this.blocks[hit.blockIndex].hitsLeft--;
                remove.add(hit.bulletIndex);
            }
            bulletGroups[i] = bulletGroups[i].filter((_, index) => !remove.has(index));
        }        
        this.bullets = bulletGroups[0];
        this.enemyBullets = bulletGroups[1];
        this.blocks = this.blocks.filter(b => b.hitsLeft > 0);

        const hits = this.collisionService.findHits(
            [...this.bullets, ...this.enemyBullets],
            [this.ship, ...this.enemyShips]
        );
        if (hits && this.stageState === StageState.Running) {
            if (hits.some(h => h.shipIndex === 0)) {
                this.stageState = StageState.PlayerShipDead;
            }
        }

        if (this.stageState === StageState.Running && this.enemyShips.every(s => s.state !== ShipState.Alive)) {
            this.stageState = StageState.EnemyShipsDead;
        }

        // Endgame-Prüfung
        if (this.stageState === StageState.PlayerShipDead && this.ship.state === ShipState.Dead && this.bullets.length === 0) {
            game.gameState = GameState.GameOver;
        } else if (this.stageState === StageState.EnemyShipsDead
            && this.enemyShips.every(s => s.state === ShipState.Dead)
            && this.enemyBullets.length === 0) {
            game.gameState = GameState.NextStage;
        }
        return game;
    }

    /**
     * Bewegt alle Gegnerischen Schiffe.
     */
    public moveEnemyShips(): void {
        this.enemyMoveTick++;
        if (this.enemyMoveTick % this.enemyMoveEvery !== 0)
            return; // diesen Aufruf auslassen, weil es nicht die Zeit ist
        for (const s of this.enemyShips) {
            if (s.state !== ShipState.Alive) continue;
            if ( s.positionX < this.ship.positionX) {
                moveShip(s, 'ArrowRight', 2, this.canvasWidth);
            } else {
                moveShip(s, 'ArrowLeft', 2, this.canvasWidth);
            }
        };
        this.enemyMoveTick = 0;
    }

    override drawEnemyShips(ctx: CanvasRenderingContext2D): void {
        this.enemyShips.forEach(s => drawShip(s, ctx));
    }

    override createEnemyBullets(): void {
        this.enemyShips.forEach(s => {
            if (s.state !== ShipState.Alive) return;
            if ( Math.random() < 0.9) return;
            const positionX = s.positionX + s.width / 2 - BULLET_WIDTH / 2;
            const positionY = s.positionY + s.height;
            if (this.enemyBullets.length < 15) {
                this.enemyBullets.push(createBullet(positionX, positionY, this.ENEMY_BULLET_VELOCITY_Y));
            }
        });
    }

    override drawBlocks(ctx: CanvasRenderingContext2D): void {
        drawBlocks(this.blocks, ctx);
    }

}
