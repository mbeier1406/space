import { Component, DestroyRef, DOCUMENT, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Stage } from '../../core/stages/stages';
import { Stage1 } from '../../core/stages/stage1';

/**
 * Home-Komponente für das Space-Spiel.
 * Diese Komponente zeigt das Space-Spiel an und steuert es.
 * @example
 * <app-home></app-home>
 */
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private readonly STD_CANVAS_SIZE = 100;
  private readonly canvasRef : Signal<ElementRef<HTMLCanvasElement> | undefined> = viewChild<ElementRef<HTMLCanvasElement>>('spaceCanvas');
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  protected readonly viewportMargin : number = 0.05; // 5% Rand um Canvas

  private tickInterval : ReturnType<typeof setInterval> | null = null;
  private worker : Worker | null = null;

  private rafId: number | null = null; // Letzte Frame-ID für requestAnimationFrame, für Spielstopp
  private boundKeyDown = (event: KeyboardEvent) => this.handleKeyDown(event);

  private currentStage : number = 1;
  private readonly stages : Record<number, Stage> = {
    1: new Stage1(),
  };
  private stage : Stage = this.stages[this.currentStage];

  /** Initialisiert die Komponente */
  constructor(private router: Router) {
  }


  /** Liefert das Window-Objekt um die Größe des Canvas-Elements zu ermitteln */
  private get win() { return this.doc.defaultView!; }

  /** Liefert den 2D-Kontext des Canvas-Elements um das Spiel zu zeichnen */
  private get ctx(): CanvasRenderingContext2D | null {
    return this.canvasRef()?.nativeElement.getContext('2d') ?? null;
  }

  /** Initialisiert das Raumschiff und die Sterne und startet das Spiel */
  protected ngAfterViewInit(): void {
    this.setCanvasSize();
    const canvasW = this.canvasRef()?.nativeElement.width ?? this.STD_CANVAS_SIZE;
    const canvasH = this.canvasRef()?.nativeElement.height ?? this.STD_CANVAS_SIZE;
    this.stage.createShip(
      canvasW / 2 - this.stage.getShipDimensions().x / 2,
      canvasH - this.stage.getShipDimensions().y,
      () => this.draw()
    );
    this.stage.createStars(canvasW, canvasH, this.STD_CANVAS_SIZE, this.stage.getShipDimensions().y);
    this.draw();
    fromEvent(this.win, 'resize')
      .pipe(debounceTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setCanvasSize();
        this.stage.setShipPosition(this.canvasRef()?.nativeElement.width ?? this.STD_CANVAS_SIZE, this.canvasRef()?.nativeElement.height ?? this.STD_CANVAS_SIZE);
        this.draw();
    });
  }

  /** Setzt Canvas-Größe auf Viewport minus Rand */
  private setCanvasSize(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const container = canvas.closest('.space-canvas') as HTMLElement | null;
    const factor = 1 - 2 * this.viewportMargin;
    if (container && container.clientWidth > 0 && container.clientHeight > 0) {
      canvas.width = Math.floor(container.clientWidth);
      canvas.height = Math.floor(container.clientHeight - 10); // für den Header
    } else {
      canvas.width = Math.floor(this.win.innerWidth * factor);
      canvas.height = Math.floor(this.win.innerHeight * factor);
    }
  }

  /** Zeichnet das Spiel */
  private gameLoop = (): void => {
    this.stage.moveBullets();
    this.draw();
    this.rafId = requestAnimationFrame(this.gameLoop);
  };
  
  /** Zeichnet den Hintergrund des Canvas-Elements und die Raumschiffe und die Bullets */
  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.stage.drawStars(ctx);
    this.stage.drawShip(ctx);
    this.stage.drawBullets(ctx);
  }

  /** Bewegt das Schiff nach rechts/links über die Pfeiltasten-Eingaben des Benutzers */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); // Verhindert das Scrollen der Seite beim Drücken der Pfeiltasten
      this.stage.moveShip(this.stage.getShip(), event.key as 'ArrowRight' | 'ArrowLeft', this.canvasRef()?.nativeElement.width ?? this.STD_CANVAS_SIZE);
    }
    if (event.key === 'Space' || event.key === ' ') {
      this.stage.createBullet(this.stage.getShip().positionX+10, this.stage.getShip().positionY-this.stage.getBulletDimensions().y);
    }
  }

  /** Startet das Spiel */
  protected startTick(): void {
    this.stopTick();
    this.worker = new Worker(new URL('../../core/worker/space-worker', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event: MessageEvent) => this.stage.getBullets = event.data.bullets;    
    this.tickInterval = setInterval(() => this.worker?.postMessage({ type: 'tick', bullets: this.stage.getBullets() }), 250);
    this.doc.addEventListener('keydown', this.boundKeyDown);
    this.rafId = requestAnimationFrame(this.gameLoop);
    console.log('started');
  }

  /** Stoppt das Spiel */
  protected stopTick(): void {
    this.tickInterval && clearInterval(this.tickInterval);
    this.tickInterval = null;
    this.worker?.terminate();
    this.worker = null;
    this.doc.removeEventListener('keydown', this.boundKeyDown);
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    console.log('stopped');
  }

  /** Kehrt zur Startseite zurück */
  protected backToStart(): void {
    this.router.navigate(['/']);
  }

}
