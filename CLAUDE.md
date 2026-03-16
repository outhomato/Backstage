# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Starta Expo dev-server (QR-kod för Expo Go)
npm run ios        # Starta med iOS-simulator
npm run android    # Starta med Android-emulator
```

Node.js är installerat via Homebrew (`/opt/homebrew/bin/node`). Om `node` inte hittas i PATH, använd full sökväg.

`npm install` ska köras med `--legacy-peer-deps` på grund av versionskonflikter mellan React Navigation och Expo SDK 54.

## Arkitektur

Expo (React Native + TypeScript) app. Varje flik visar en webbsida via WebView. Menykonfigurationen hämtas dynamiskt från servern vid uppstart.

```
App.tsx                          # Ingångspunkt — SafeAreaProvider + usePushNotifications
app/
  index.tsx                      # Tab-navigator, byggs dynamiskt från menu.json
  hooks/
    useMenuConfig.ts             # Hämtar menu.json från servern baserat på platform (ios/android)
    usePushNotifications.ts      # Ber om tillstånd, hämtar Expo push token, registrerar mot server
  screens/
    WebScreen.tsx                # WebView som fyller hela skärmen (ingen SafeAreaView)
server/
  register/index.php             # POST-endpoint: tar emot push token, sparar i tokens.json
  notify/index.php               # POST-endpoint: skickar notis till alla sparade tokens via Expo API
```

## Serverkonfiguration

Meny och ikoner hämtas från:
- iOS: `https://www.spangascouterna.se/backstage/apps/mobile/ios/`
- Android: `https://www.spangascouterna.se/backstage/apps/mobile/android/`

`menu.json`-format:
```json
{
  "tabs": [
    { "label": "Hem", "icon": "home", "url": "https://...", "initial": true }
  ]
}
```

Ikoner är PNG-filer i undermappen `icons/` (t.ex. `icons/home.png`). `tintColor` appliceras automatiskt så ikonerna bör vara monokroma.

Push token-registrering postas till:
`https://www.spangascouterna.se/backstage/apps/mobile/register/`

Tokens sparas i `register/tokens.json` på servern. `notify/index.php` läser den filen och skickar via Expo's Push API (`https://exp.host/--/api/v2/push/send`).

## Viktiga designbeslut

- **Tab-tryck laddar alltid om** till fliken ursprungs-URL (WebView remonteras via `resetKeys`-state)
- **Tab bar är genomskinlig** på iOS (`position: absolute` + `BlurView` med `systemUltraThinMaterial`)
- **SAML2** fungerar i WebView tack vare `sharedCookiesEnabled` och `thirdPartyCookiesEnabled`
- **Push-notiser** fungerar i Expo Go för testning men kräver EAS Build för produktion

## Inför native-byggnad (EAS Build)

Behöver göras innan första build:
- Sätt `bundleIdentifier` (iOS) och `package` (Android) i `app.json`, t.ex. `se.spangascouterna.backstage`
- Apple Developer-konto (99 USD/år) krävs för iOS
- Kör `eas build:configure` följt av `eas build --platform ios|android`
