interface Star {
    x: number;
    y: number;
    radius: number;
    color: string;
}

export default Star;

/**
 * Erstellt eine bestimmte Anzahl von Sternen auf dem Canvas
 * @param canvasWidth - Die Breite des Canvas
 * @param canvasHeight - Die Höhe des Canvas
 * @param stdCanvasSize - Die Standardgröße des Canvas
 * @param shipHeight - Die Höhe des Raumschiffs
 * @returns Ein Array von Sternen mit zufälligen X- und Y-Positionen und einem Radius von 1 Pixel
 * @example
 * const stars = createStars(1000, 1000, 100, 70);
 */
export function createStars(canvasWidth: number, canvasHeight: number, stdCanvasSize: number, shipHeight: number) : Star[] {
    const starCount = Math.floor(Math.random()*100);
    const stars : Star[] = [];
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * (canvasWidth ?? stdCanvasSize),
            y: Math.random() * ((canvasHeight ?? stdCanvasSize)-shipHeight),
            radius: 1,
            color: '#ffffff',
        });
    }
    return stars;
}

/**
 * Zeichnet die Sterne auf den Canvas
 * @param stars - Ein Array von Sternen
 * @param ctx - Der CanvasRenderingContext2D
 * @returns void
 * @example
 * drawStars(stars, ctx);
 */
export function drawStars(stars: Star[], ctx: CanvasRenderingContext2D): void {
    for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.fill();
    }
}
