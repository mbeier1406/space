import { Component, DestroyRef, DOCUMENT, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  canvasRef : Signal<ElementRef<HTMLCanvasElement> | undefined> = viewChild<ElementRef<HTMLCanvasElement>>('spaceCanvas');
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  protected readonly shipWidth : number = 56; // Breite des Raumschiffs
  protected readonly shipHeight : number = 70; // Höhe des Raumschiffs
  protected readonly viewportMargin : number = 0.05; // 5% Rand um Canvas

  /** Startet das Spiel */
  protected ngAfterViewInit(): void {
    this.setCanvasSize();
    this.draw();
    fromEvent(this.win, 'resize')
      .pipe(debounceTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setCanvasSize();
        this.draw();
      });
  }

  /** Liefert das Window-Objekt */
  private get win() { return this.doc.defaultView!; }

  /** Liefert den 2D-Kontext des Canvas-Elements */
  private get ctx(): CanvasRenderingContext2D | null {
    return this.canvasRef()?.nativeElement.getContext('2d') ?? null;
  }

  /** Setzt Canvas-Größe auf Viewport minus Rand */
  private setCanvasSize(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const factor = 1 - 2 * this.viewportMargin;
    canvas.width = Math.floor(this.win.innerWidth * factor);
    canvas.height = Math.floor(this.win.innerHeight * factor);
  }
  
  /** Zeichnet den Hintergrund des Canvas-Elements und die Raumschiffe */
  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const canvas = ctx.canvas;

    // Hintergrund
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = '/ship.png'
    img.onload = () => {
      ctx.drawImage(img, canvas.width/2-this.shipWidth/2, canvas.height-this.shipHeight, this.shipWidth, this.shipHeight);
    };

  }

}
