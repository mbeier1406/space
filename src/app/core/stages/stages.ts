import Ship from "../models/ship";
import Bullet from "../models/bullet";
import Star from "../models/star";
import { type Point2D } from "../../shared/point2d";

/**
 * Interface für eine Stage.
 * Definiert die Eigenschaften einer Spielstufe.
 * @example
 * const stage = new Stage1();
 * stage.createShip(100, 100, () => {
 *   console.log('Bild geladen');
 * });
 */
export interface Stage {
    id: number;
    name: string;
    description: string;
    stars: Star[];
    ship: Ship;
    readonly maxBullets: number;
    bullets: Bullet[];

    /**
     * Initialisiert die Stage. Dazu zählt das zeichnen
     * des Hintergrunds, der Sterne, der Raumschiffe usw. .
     * @param canvasWidth - Die Breite des Canvas.
     * @param canvasHeight - Die Höhe des Canvas.
     * @param stdCanvasSize - Die Standardgröße des Canvas, falls canvasWidth/canvasHeight nicht gesetzt sind.
     * @returns void
     * @example
     * initStage(1000, 1000, 100);
     */
    initStage(
        canvasWidth: number | undefined,
        canvasHeight: number | undefined,
        stdCanvasSize: number
    ): void;

    /**
     * Spielt die Stage ab. Dazu zählt das Bewegen aller automatisch gesteuerten Objekte,
     * also der Bullets, der Raumschiffe usw.
     * @returns void
     * @example
     * playStage();
     */
    playStage(): void;

    /**
     * Zeichnet die Sterne auf den Canvas.
     * @param ctx - Der CanvasRenderingContext2D.
     * @returns void
     */
    drawStars(ctx: CanvasRenderingContext2D): void;

    /**
     * Setzt das Raumschiff an die gegebenen Position.
     * @param positionX - Die X-Position des Raumschiffs.
     * @param positionY - Die Y-Position des Raumschiffs.
     * @returns void
     */
    setShipPosition(positionX: number, positionY: number): void;

    /**
     * Liefert das Raumschiff.
     * @returns Das Raumschiff.
     */
    getShip(): Ship;

    /**
     * Zeichnet das Raumschiff auf den Canvas.
     * @param ctx - Der CanvasRenderingContext2D.
     * @returns void
     */
    drawShip(ctx: CanvasRenderingContext2D): void;

    /**
     * Bewegt das Raumschiff nach links oder rechts innerhalb des Canvas.
     * @param ship - Das Raumschiff.
     * @param direction - Die Richtung, in die das Raumschiff bewegt werden soll.
     * @param canvasWidth - Die Breite des Canvas.
     * @returns void
     */
    moveShip(ship: Ship, direction: 'ArrowRight' | 'ArrowLeft', canvasWidth: number): void;

    /**
     * Zeichnet die feindlichen Schiffe auf den Canvas.
     * @param ctx - Der CanvasRenderingContext2D.
     * @returns void
     */
    drawEnemyShips(ctx: CanvasRenderingContext2D): void;

    /**
     * Erstellt eine Bullet an der Position des Schiffs.
     */
    createBullet(): void;

    /**
     * Liefert die Bullets.
     * @returns Die Bullets.
     */
    getBullets(): Bullet[];

    /**
     * Zeichnet die Bullets auf den Canvas.
     * @param ctx - Der CanvasRenderingContext2D.
     * @returns void
     */
    drawBullets(ctx: CanvasRenderingContext2D): void;

}
