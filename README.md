# Space

Ein Arcade Retro-Game basierend auf Angular.

## Technologie-Stack

- Lunux Ubuntu 24.04
- **Node Version Manager (nvm) v0.40.3**
- **Node.js (node) v24.12.0**
- **Node Package Manager (npm) v11.6.2**
- **Angular (ng) v21.0.4**
- **TypeScript Version (npx) 11.6.2**
- **json-server v1.0.0-beta.3**

## Installation

```bash
# NVM installieren
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Bash Konfiguration neu laden
$ source ~/.bashrc

# Node.js 24 installieren (passend für Angular 21)
$ nvm install 24

# Verwendete Version festlegen
$ nvm use 24

# Versionen prüfen
$ node --version
$ npm --version

$ npm list --global --depth=0
/home/mbeier/.nvm/versions/node/v24.12.0/lib
├── @angular/cli@21.0.4
├── bookmonkey-api@3.2.0
├── corepack@0.34.5
├── json-server@1.0.0-beta.3
└── npm@11.6.2
```

**Installation Angular**

Benötigt wird die Angular CLI:

```bash
# Angular CLI global installieren
$ npm install -g @angular/cli@21

# Angular Version prüfen
$ ng version
```

Projekt anlegen (mit Angular Routing und Standard CSS):

```bash
$ ng new space

# In das Projektverzeichnis wechseln
$ cd space

# Entwicklungsserver starten
$ ng serve

# Das Spiel läuft dann auf: http://localhost:4200
```

## Projekt bauen

Um das Projekt zu bauen, ist auszuführen:

```bash
$ ng build
```

Kompiliert das Projekt und speichert die Artefakte im `dist/` Verzeichnis.

## Unit Tests ausführen

Mit dem [Vitest](https://vitest.dev/) Test-Runner werden ide `*.spec.ts-test` ausgeführt.
Ein Beispiel für ein Test ist `src/app/app.spec.ts`.

```bash
$ ng test
```

## Dokumentation

Installation Compdoc:

```bash
$ npm install --save-dev @compodoc/compodoc
```

Verwendung:

```bash
# Generiert die HTML-Dateien im Ordner /documentation/
$ npx compodoc -p tsconfig.json

# Mit Live-Server (Web-Server lokal starten und Dokumentation anzeigen) und Änderungsüberwachung
# Anzeigen unter der URL http://localhost:8080
$ npx compodoc -p tsconfig.json -s -w

# In /package.json hinzufügen (dann nur noch npx run compdoc):
"scripts": {
  "compodoc": "compodoc -p tsconfig.json -s"
}
```
