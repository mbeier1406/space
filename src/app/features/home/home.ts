import { Component, DestroyRef, DOCUMENT, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

import Star from '../../core/models/star';
import Bullet from '../../core/models/bullet';
import Ship, { createShip, moveShip, repositionShip } from '../../core/models/ship';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private readonly canvasRef : Signal<ElementRef<HTMLCanvasElement> | undefined> = viewChild<ElementRef<HTMLCanvasElement>>('spaceCanvas');
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  protected readonly viewportMargin : number = 0.05; // 5% Rand um Canvas

  private tickInterval : ReturnType<typeof setInterval> | null = null;
  private worker : Worker | null = null;

  private rafId: number | null = null; // Letzte Frame-ID für requestAnimationFrame, für Spielstopp
  private boundKeyDown = (event: KeyboardEvent) => this.handleKeyDown(event);

  private canvasWidth : number = 0;
  private canvasHeight : number = 0;

  protected ship : Ship | undefined = undefined;
  protected stars : Star[] = [];
  protected bullets : Bullet[] = [];

  /** Initialisiert die Komponente */
  constructor(private router: Router) {
  }


  /** Initialisiert das Raumschiff und die Sterne und startet das Spiel */
  protected ngAfterViewInit(): void {
    this.setCanvasSize();
    const canvasW = this.canvasRef()?.nativeElement.width ?? 100;
    const canvasH = this.canvasRef()?.nativeElement.height ?? 100;
    const shipW = 56;
    const shipH = 70;
    this.ship = createShip(
      canvasW / 2 - shipW / 2,
      canvasH - shipH,
      () => this.draw()
    );  
    const starCount = Math.floor(Math.random()*100);
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * (this.canvasRef()?.nativeElement.width ?? 100),
        y: Math.random() * ((this.canvasRef()?.nativeElement.height ?? 100)-this.ship!.height),
        radius: 1,
        color: '#ffffff',
      });
    }
    this.draw();
    fromEvent(this.win, 'resize')
      .pipe(debounceTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setCanvasSize();
        repositionShip(this.ship!, this.canvasRef()?.nativeElement.width ?? 100, this.canvasRef()?.nativeElement.height ?? 100);
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
    const container = canvas.closest('.space-canvas') as HTMLElement | null;
    const factor = 1 - 2 * this.viewportMargin;
    if (container && container.clientWidth > 0 && container.clientHeight > 0) {
      canvas.width = Math.floor(container.clientWidth);
      canvas.height = Math.floor(container.clientHeight - 10); // für den Header
    } else {
      canvas.width = Math.floor(this.win.innerWidth * factor);
      canvas.height = Math.floor(this.win.innerHeight * factor);
    }
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  /** Zeichnet das Spiel */
  private gameLoop = (): void => {
    this.moveBullets();
    this.draw();
    this.rafId = requestAnimationFrame(this.gameLoop);
  };
  
  /** Zeichnet den Hintergrund des Canvas-Elements und die Raumschiffe */
  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const canvas = ctx.canvas;

    // Hintergrund
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.drawStars();
    this.drawShip();
    this.drawBullets();
  }

  /** Zeichnet die Sterne */
  private drawStars(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    for (const star of this.stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      ctx.fillStyle = star.color;
      ctx.fill();
    }
  }

  /** Löscht das letzte Raumschiff und zeichnet das neue */
  private drawShip(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.ship!.lastPositionX, this.ship!.positionY, this.ship!.width, this.ship!.height);
    this.ship!.lastPositionX = this.ship!.positionX;
    ctx.drawImage(this.ship!.image, this.ship!.positionX, this.ship!.positionY, this.ship!.width, this.ship!.height);
  }

  /** Zeichnet die aktiven Bullets */
  private drawBullets(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    for (const bullet of this.bullets) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(bullet.x, bullet.oldY, bullet.width, bullet.height);
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
  }

  /** Bewegt das Schiff nach rechts/links über die Pfeiltasten-Eingaben des Benutzers */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); // Verhindert das Scrollen der Seite beim Drücken der Pfeiltasten
      moveShip(this.ship!, event.key as 'ArrowRight' | 'ArrowLeft', this.canvasWidth);
    }
    if (event.key === 'Space' || event.key === ' ') {
      if (this.bullets.length < 3) {
        this.bullets.push({
          x: this.ship!.positionX+5,
          y: this.ship!.positionY-15,
          oldY: this.ship!.positionY-15,
          velocityY: 15,
          width: 5,
          height: 15,
          color: '#ffffff',
        });
      }
    }
    console.log('shipX', this.ship!.positionX);
  }

  /** Startet das Spiel */
  protected startTick(): void {
    this.stopTick();
    this.worker = new Worker(new URL('../../core/worker/space-worker', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event: MessageEvent) => this.bullets = event.data.bullets;    
    this.tickInterval = setInterval(() => this.worker?.postMessage({ type: 'tick', bullets: this.bullets }), 250);
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

  /** Berechnet die neue Position der Bullets und entfernt die Bullets außerhalb des Bildschirms */
  protected moveBullets(): void {
    this.bullets = this.bullets
      .filter((bullet: Bullet) => bullet.y >= 0)
      .map((bullet: Bullet) => ({
        ...bullet,
        oldY: bullet.y,
        y: bullet.y - bullet.velocityY,
      }));
  }

}
