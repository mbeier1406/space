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
    stars: Star[] = [];
    ship: Ship = createShip(0, 0, () => {});
    readonly maxBullets: number = 3;
    bullets: Bullet[] = [];    

    public initStage(
        canvasWidth: number,
        canvasHeight: number,
        stdCanvasSize: number
    ): void {
        this.createShip((canvasWidth ?? stdCanvasSize) / 2 - this.ship.width / 2, (canvasHeight ?? stdCanvasSize) - this.ship.height, () => {});
        this.createStars(canvasWidth, canvasHeight, stdCanvasSize, this.ship.height);
    }

    public playStage(): void {
        this.moveBullets();
    }

    public createStars(
        canvasWidth: number,
        canvasHeight: number,
        stdCanvasSize: number,
        shipHeight: number
    ): void {
        this.stars = createStars(canvasWidth, canvasHeight, stdCanvasSize, shipHeight);
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
        this.ship = createShip(positionX, positionY, onImageLoaded);
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

    public moveShip(ship: Ship, direction: 'ArrowRight' | 'ArrowLeft', canvasWidth: number): void {
        moveShip(ship, direction, canvasWidth);
    }

    public createBullet(positionX: number, positionY: number): void {
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
