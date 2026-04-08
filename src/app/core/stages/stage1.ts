import Star, { createStars, drawStars } from "../models/star";
import Ship, { createShip, drawShip, moveShip, repositionShip, ShipState } from "../models/ship";
import Bullet, { BULLET_HEIGHT, BULLET_WIDTH, createBullet, drawBullets, moveBullets } from "../models/bullet";
import { Stage, StageState } from "./stages";
import { createPoint2D, type Point2D } from "../../shared/point2d";
import { game, Game, GameState } from "../models/game";
import { CollisionService } from "../services/collision.service";

/**
 * Stage 1 - Erste Stage des Spiels.
 * Diese Stage ist die erste Stage des Spiels.
 * Sie enthält ein Raumschiff, das sich bewegt und schießt.
 * @example
 * const stage1 = new Stage1();
 * stage1.createShip(100, 100, () => { console.log('Bild geladen'); });
 */
export class Stage1 implements Stage {
    stageState: StageState = StageState.Running;
    id: number = 1;
    name: string = 'Stage 1';
    description: string = 'This is the first stage of the game.';
    protected canvasWidth: number = 0;
    protected canvasHeight: number = 0;
    protected stdCanvasSize: number = 0;
    collisionService: CollisionService = new CollisionService();
    stars: Star[] = [];
    ship: Ship = createShip(0, 0, '/ship.png', () => {});
    enemyShip: Ship = createShip(0, 0, '/enemy-ship.png', () => {});
    protected enemyMoveTick = 0;
    protected enemyMoveEvery = 4; // nur bei jedem x. Aufruf das feindliche Schiff bewegen
    readonly maxBullets: number = 3;
    bullets: Bullet[] = [];    
    readonly BULLET_VELOCITY_Y = 15;
    enemyBullets: Bullet[] = [];
    readonly ENEMY_BULLET_VELOCITY_Y = -15;

    public getGame(): Game {
        return game;
    }

    public initStage(
        canvasWidth: number,
        canvasHeight: number,
        stdCanvasSize: number
    ): void {
        this.stageState = StageState.Running;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.stdCanvasSize = stdCanvasSize;
        this.createShip((canvasWidth ?? stdCanvasSize) / 5 - this.ship.width / 2, (canvasHeight ?? stdCanvasSize) - this.ship.height, () => {});
        this.createStars(this.ship.height);
        this.createEnemyShip(canvasWidth / 2 - this.ship.width / 2, 0);
        this.bullets = [];
        this.enemyBullets = [];
        game.gameState = GameState.Intro;
    }

    public playStage(): Game {
        this.moveBullets();
        this.moveEnemyShip();
        this.createEnemyBullets();
        this.moveEnemyBullets();
        const hits = this.collisionService.findHits([... this.bullets, ... this.enemyBullets], [this.ship, this.enemyShip]);
        if (hits && this.stageState === StageState.Running) {
            this.stageState = hits[0].shipIndex === 0 ? StageState.PlayerShipDead : StageState.EnemyShipsDead;
        }
        if (this.stageState === StageState.PlayerShipDead && this.bullets.length === 0) {
            game.gameState = GameState.GameOver;
        } else if (this.stageState === StageState.EnemyShipsDead && this.enemyBullets.length === 0) {
            game.gameState = GameState.NextStage;
        }
        return game;
    }

    public createStars(
        shipHeight: number
    ): void {
        this.stars = createStars(this.canvasWidth, this.canvasHeight, this.stdCanvasSize, shipHeight);
    }

    public drawStars(ctx: CanvasRenderingContext2D): void {
        drawStars(this.stars, ctx);
    }

    public createShip(
        positionX: number,
        positionY: number,
        onImageLoaded: () => void
    ): void {
        console.log('createShip', positionX, positionY);
        this.ship = createShip(positionX, positionY, '/ship.png', onImageLoaded);
    }

    public getShip(): Ship {
        return this.ship;
    }

    public getShipDimensions(): Point2D {
        return createPoint2D(this.ship.width, this.ship.height);
    }

    public setShipPosition(positionX: number, positionY: number): void {
        repositionShip(this.ship, positionX, positionY);
    }

    public drawShip(ctx: CanvasRenderingContext2D): void {
        drawShip(this.ship, ctx);
    }


    public moveShip(ship: Ship, direction: 'ArrowRight' | 'ArrowLeft'): void {
        if (ship.state === ShipState.Dead) return;
        moveShip(ship, direction, 10, this.canvasWidth);
    }

    public createBullet(): void {
        if (this.ship.state === ShipState.Dead) return;
        const positionX = this.ship.positionX + this.ship.width / 2 - BULLET_WIDTH / 2;
        const positionY = this.ship.positionY - BULLET_HEIGHT-1;
        if (this.bullets.length < this.maxBullets) {
            this.bullets.push(createBullet(positionX, positionY, this.BULLET_VELOCITY_Y));
        }
    }

    public getBullets(): Bullet[] {
        return this.bullets;
    }

    public getBulletDimensions(): Point2D {
        return createPoint2D(BULLET_WIDTH, BULLET_HEIGHT);
    }

    public moveBullets(): void {
        this.bullets = moveBullets(this.bullets, this.canvasHeight);
    }

    public drawBullets(ctx: CanvasRenderingContext2D): void {
        drawBullets(this.bullets, ctx);
    }

    public createEnemyShip(positionX: number, positionY: number): void {
        this.enemyShip = createShip(positionX, positionY, '/enemy-ship.png', () => {});
    }

    public drawEnemyShips(ctx: CanvasRenderingContext2D): void {
        drawShip(this.enemyShip, ctx);
    }

    public moveEnemyShip(): void {
        if (this.enemyShip.state === ShipState.Dead) return;
        this.enemyMoveTick++;
        if (this.enemyMoveTick % this.enemyMoveEvery !== 0) {
            return; // diesen Aufruf auslassen, weil es nicht die Zeit ist
        }
        if ( this.enemyShip.positionX < this.ship.positionX) {
            moveShip(this.enemyShip, 'ArrowRight', 2, this.canvasWidth);
        } else {
            moveShip(this.enemyShip, 'ArrowLeft', 2, this.canvasWidth);
        }
        this.enemyMoveTick = 0;
    }

    public createEnemyBullets(): void {
        if (this.enemyShip.state === ShipState.Dead) return;
        if ( Math.random() < 0.9) return;
        const positionX = this.enemyShip.positionX + this.enemyShip.width / 2 - BULLET_WIDTH / 2;
        const positionY = this.enemyShip.positionY + this.enemyShip.height;
        if (this.enemyBullets.length < 10) {
            this.enemyBullets.push(createBullet(positionX, positionY, this.ENEMY_BULLET_VELOCITY_Y));
        }
    }

    public drawEnemyBullets(ctx: CanvasRenderingContext2D): void {
        drawBullets(this.enemyBullets, ctx);
    }

    public moveEnemyBullets(): void {
        this.enemyBullets = moveBullets(this.enemyBullets, this.canvasHeight);
    }

}
