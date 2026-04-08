
/** Zustand des Raumschiffs */
export enum ShipState {
    Alive = 'ALIVE',
    Dead = 'DEAD',
}

/** Interface für das Raumschiff */
interface Ship {
    state : ShipState;
    positionX : number;
    positionY : number;
    lastPositionX : number;
    image : HTMLImageElement;
    readonly width : number;
    readonly height : number;
}
export default Ship;

export const SHIP_WIDTH = 56;
export const SHIP_HEIGHT = 70;

/**
 * Erstellt ein neues Raumschiff und lädt das Bild
 * @param positionX - Die X-Position des Raumschiffs
 * @param positionY - Die Y-Position des Raumschiffs
 * @param onImageLoaded - Die Funktion, die aufgerufen wird, wenn das Bild geladen ist
 * @returns Das neue Raumschiff
 * @example
 * const ship = createShip(100, 100, () => {
 *   console.log('Bild geladen');
 * });
 */
export function createShip(
    positionX: number,
    positionY: number,
    img: string,
    onImageLoaded: () => void
  ): Ship {
    const image = new Image();
    image.onload = onImageLoaded;
    image.src = img;
    return {
        state: ShipState.Alive,
        positionX,
        positionY,
        lastPositionX: positionX,
        image: image,
        width: SHIP_WIDTH,
        height: SHIP_HEIGHT,
    };
}

/**
 * Setzt die Position des Raumschiffs auf den Mittelpunkt des Canvas
 * @param ship - Das Raumschiff
 * @param canvasWidth - Die Breite des Canvas
 * @param canvasHeight - Die Höhe des Canvas
 * @returns void
 * @example
 * repositionShip(ship!, canvasWidth, canvasHeight);
 */
export function repositionShip(ship: Ship, canvasWidth: number, canvasHeight: number): void {
    ship!.positionX = (canvasWidth / 2) - (ship!.width / 2);
    ship!.positionY = canvasHeight - ship!.height;
    ship!.lastPositionX = ship!.positionX;
}

/**
 * Bewegt das Raumschiff nach links oder rechts innerhalb des Canvas.
 * @param ship - Das Raumschiff
 * @param direction - Die Richtung, in die das Raumschiff bewegt werden soll
 * @param speed - Die Geschwindigkeit, mit der das Raumschiff bewegt wird
 * @returns void
 * @example
 * moveShip(ship!, 'ArrowRight', 10, 1000);
 */
export function moveShip(ship: Ship, direction: 'ArrowRight' | 'ArrowLeft', speed: number, canvasWidth: number): void {
    if (direction === 'ArrowLeft') {
        if (ship!.positionX > 0) ship!.positionX -= speed;
    } else if (direction === 'ArrowRight') {
        if (ship!.positionX < canvasWidth - ship!.width) {
            ship!.positionX += speed;
        }
    }
}

/**
 * Zeichnet das Raumschiff auf den Canvas. Löscht die letzte Position des Raumschiffs und zeichnet es neu.
 * Aktualisiert die letzte Position des Raumschiffs.
 * @param ship - Das Raumschiff
 * @param ctx - Der CanvasRenderingContext2D
 * @returns void
 * @example
 * drawShip(ship!, ctx);
 */
export function drawShip(ship: Ship, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000000';
    ctx.fillRect(ship!.lastPositionX, ship!.positionY, ship!.width, ship!.height);
    ship!.lastPositionX = ship!.positionX;
    ctx.drawImage(ship!.image, ship!.positionX, ship!.positionY, ship!.width, ship!.height);
}
