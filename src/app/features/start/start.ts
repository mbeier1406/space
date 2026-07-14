import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Start-Component
 * @description
 * Diese Komponente stellt die Startseite des Spiels dar.
 * Sie enthält die Logik für den Start-Button und navigiert zur Stage Komponente.
 */
@Component({
  selector: 'app-start',
  imports: [],
  templateUrl: './start.html',
  styleUrl: './start.css',
})
export class Start {

  constructor(private router: Router) {}

  /** Startet das Spiel */
  protected startGame(): void {
    this.router.navigate(['/game']);
  }
}
