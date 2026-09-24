/**
 * Globale Konfiguration der Anwendung.
 *
 * Wird in main.ts an bootstrapApplication(App, appConfig) übergeben.
 * Hier stehen keine Komponenten, sondern Provider: Dienste und Features,
 * die Angular beim Start einmal für die ganze App einrichtet.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideRouter } from '@angular/router';
import localeDe from '@angular/common/locales/de';
import routes from './app.routes';

/**
 * Meldet deutsche Locale-Daten an (Datums-/Zahlenformat).
 * Ohne diese Zeile kennt Angular nur die Standard-Locale (meist en-US).
 * Steht außerhalb von appConfig, weil es eine einmalige Registrierung ist,
 * kein Provider.
 */
registerLocaleData(localeDe);

/**
 * ApplicationConfig: Objekt mit der Liste der Provider.
 *
 * Jeder Eintrag in providers macht eine Fähigkeit in der App verfügbar.
 * Komponenten holen sich diese später per inject() oder dem Konstruktor.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Fängt nicht behandelte Fehler im Browser ein (z. B. in Promises),
    // statt dass sie nur in der Konsole landen.
    provideBrowserGlobalErrorListeners(),
    // Aktiviert den Router und übergibt die Routen aus app.routes.ts:
    // '' → Start, 'game' → Home (das Spiel), alles andere → zurück zu ''.
    provideRouter(routes)
  ]
};
