/**
 * Einstiegspunkt der Angular-Anwendung.
 *
 * Der Browser lädt zuerst index.html. Darin steht nur <app-root></app-root>.
 * Angular CLI startet danach diese Datei (siehe angular.json, "browser": "src/main.ts").
 *
 * Ablauf:
 * 1. bootstrapApplication erzeugt die App im Browser (kein NgModule, Standalone-API).
 * 2. Als Wurzel-Komponente wird App verwendet (src/app/app.ts, Selektor app-root).
 *    Angular ersetzt <app-root> durch deren Template (app.html) — dort sitzt der Router.
 * 3. appConfig (src/app/app.config.ts) liefert die Provider, z. B. den Router mit app.routes.ts.
 *
 * Schlägt der Start fehl (z. B. Import-Fehler), landet die Ursache in der Konsole.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
