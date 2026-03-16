# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Starta Expo dev-server (öppnar QR-kod för Expo Go)
npm run ios        # Starta med iOS-simulator
npm run android    # Starta med Android-emulator
npm run web        # Starta i webbläsare
```

Node.js är installerat via Homebrew (`/opt/homebrew/bin/node`). Om `node` inte hittas i PATH, använd full sökväg.

Det finns inget testsystem konfigurerat ännu.

## Arkitektur

Appen är en **Expo**-app (React Native + TypeScript) med en bottom tab-navigator där varje flik visar en webbsida via WebView.

```
App.tsx               # Ingångspunkt — wrappas i SafeAreaProvider
app/
  index.tsx           # NavigationContainer + bottom tab-navigator, definierar flikar och deras URLs
  screens/
    WebScreen.tsx     # Återanvändbar komponent: tar en `url`-prop och renderar en WebView
```

**Lägga till en ny flik:** lägg till ett `<Tab.Screen>`-block i `app/index.tsx` med ett namn och en URL, samt en emoji i `icons`-mappen i samma fil.

**Navigationsbibliotek:** `@react-navigation/bottom-tabs` v7 — tab-konfiguration sker i `app/index.tsx`.
