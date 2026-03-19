/** Interface für das Raumschiff */
interface Ship {
    positionX : number;
    positionY : number;
    lastPositionX : number;
    image : HTMLImageElement;
    readonly width : number;
    readonly height : number;
}
export default Ship;

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
    onImageLoaded: () => void
  ): Ship {
    const image = new Image();
    image.onload = onImageLoaded;
    image.src = '/ship.png';
    return {
      positionX,
      positionY,
      lastPositionX: positionX,
      image,
      width: 56,
      height: 70,
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
 * @param canvasWidth - Die Breite des Canvas
 * @returns void
 * @example
 * moveShip(ship!, 'ArrowRight', 1000);
 * @param canvasWidth 
 */
export function moveShip(ship: Ship, direction: 'ArrowRight' | 'ArrowLeft', canvasWidth: number): void {
    if (direction === 'ArrowLeft') {
        if (ship!.positionX > 0) ship!.positionX -= 10;
    } else if (direction === 'ArrowRight') {
        if (ship!.positionX < canvasWidth - ship!.width) {
            ship!.positionX += 10;
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
