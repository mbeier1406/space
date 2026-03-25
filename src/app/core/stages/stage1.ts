import Star, { createStars, drawStars } from "../models/star";
import Ship, { createShip, drawShip, moveShip, repositionShip } from "../models/ship";
import Bullet, { BULLET_HEIGHT, BULLET_WIDTH, createBullet, drawBullets, moveBullets } from "../models/bullet";
import { Stage } from "./stages";
import { createPoint2D, type Point2D } from "../../shared/point2d";

/**
 * Stage 1 - Erste Stage des Spiels.
 * Diese Stage ist die erste Stage des Spiels.
 * Sie enthält ein Raumschiff, das sich bewegt und schießt.
 * @example
 * const stage1 = new Stage1();
 * stage1.createShip(100, 100, () => { console.log('Bild geladen'); });
 */
export class Stage1 implements Stage {
    id: number = 1;
    name: string = 'Stage 1';
    description: string = 'This is the first stage of the game.';
    canvasWidth: number = 0;
    canvasHeight: number = 0;
    stdCanvasSize: number = 0;
    stars: Star[] = [];
    ship: Ship = createShip(0, 0, '/ship.png', () => {});
    enemyShips: Ship[] = [];
    private enemyMoveTick = 0;
    private readonly enemyMoveEvery = 4; // nur bei jedem x. Aufruf das feindliche Schiff bewegen
    readonly maxBullets: number = 3;
    bullets: Bullet[] = [];    

    public initStage(
        canvasWidth: number,
        canvasHeight: number,
        stdCanvasSize: number
    ): void {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.stdCanvasSize = stdCanvasSize;
        this.createShip((canvasWidth ?? stdCanvasSize) / 2 - this.ship.width / 2, (canvasHeight ?? stdCanvasSize) - this.ship.height, () => {});
        this.createStars(this.ship.height);
        this.createEnemyShip(canvasWidth / 2 - this.ship.width / 2, 0);
    }

    public playStage(): void {
        this.moveBullets();
        this.moveEnemyShips();
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
        moveShip(ship, direction, 10, this.canvasWidth);
    }

    public createEnemyShip(positionX: number, positionY: number): void {
        this.enemyShips.push(createShip(positionX, positionY, '/enemy-ship.png', () => {}));
    }

    public drawEnemyShips(ctx: CanvasRenderingContext2D): void {
        this.enemyShips.forEach(ship => drawShip(ship, ctx));
    }

    public moveEnemyShips(): void {
        this.enemyMoveTick++;
        if (this.enemyMoveTick % this.enemyMoveEvery !== 0) {
            return; // diesen Aufruf auslassen, weil es nicht die Zeit ist
        }
        this.enemyShips.forEach(ship => {
            if ( ship.positionX < this.ship.positionX) {
                moveShip(ship, 'ArrowRight', 2, this.canvasWidth);
            } else {
                moveShip(ship, 'ArrowLeft', 2, this.canvasWidth);
            }
        });
        this.enemyMoveTick = 0;
    }

    public createBullet(): void {
        const positionX = this.ship.positionX + this.ship.width / 2 - BULLET_WIDTH / 2;
        const positionY = this.ship.positionY + this.ship.height / 2 - BULLET_HEIGHT / 2;
        if (this.bullets.length < this.maxBullets) {
            this.bullets.push(createBullet(positionX, positionY));
        }
    }

    public getBullets(): Bullet[] {
        return this.bullets;
    }

    public getBulletDimensions(): Point2D {
        return createPoint2D(BULLET_WIDTH, BULLET_HEIGHT);
    }

    public moveBullets(): void {
        this.bullets = moveBullets(this.bullets);
    }

    public drawBullets(ctx: CanvasRenderingContext2D): void {
        drawBullets(this.bullets, ctx);
    }

}
