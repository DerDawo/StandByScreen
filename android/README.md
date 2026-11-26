# StandByScreen – native Android-App

Native Android-Hülle um die bestehende Web-App. Uhren (Nunito, Kenia, SixCaps, Badeen),
Farbpaletten, Ziffern-Rotation, Timeout-Abdunklung und Menüs kommen 1:1 aus dem Repo-Root
(`index.html`, `script.js`, `components/`, `src/`) und werden beim Build in die APK gepackt.
Kein Hosting, keine PWA, läuft komplett offline.

Neu und nativ ist die **Automatik**: Lädt das Handy kabellos, steht es im Querformat und ist es
gesperrt, öffnet sich der Standby automatisch über dem Sperrbildschirm (ohne Entsperren).
Wird das Laden beendet oder das Handy hochkant gedreht, schließt er sich wieder.

## APK bekommen

* GitHub → **Actions** → „Android APK“ → letzter Lauf → Artefakt **StandByScreen-apk** herunterladen
  (ZIP entpacken, `.apk` aufs Handy, installieren, „Unbekannte Apps installieren“ erlauben).
* Oder ein Tag `v1.0.0` pushen: dann hängt die APK zusätzlich an einem GitHub-Release.
* Lokal: `cd android && ./gradlew assembleDebug` (Android SDK nötig, z. B. über Android Studio).

Alle Builds sind mit demselben (öffentlichen) Debug-Schlüssel `app/debug.keystore` signiert,
damit neue APKs als Update über die alte installiert werden können.

## Einrichtung auf dem Samsung

1. App öffnen, **Automatischer Standby** einschalten.
2. Unter **Berechtigungen** alles auf ✓ bringen:
   * Benachrichtigungen
   * **Über anderen Apps anzeigen** (wichtigster Punkt: erlaubt das Starten aus dem Hintergrund)
   * Vollbild-Benachrichtigungen (Android 14+, Ersatzweg)
   * Akku-Optimierung aus
3. One UI: *Einstellungen › Akku › Hintergrundnutzungslimits › Nie in Standby versetzte Apps*
   → StandByScreen hinzufügen.
4. Handy aufs Induktions-Pad im Querformat stellen und sperren. Im Bereich **Live-Status**
   der App siehst du, ob Laden/Kabellos/Querformat erkannt werden.

Den Standby schließt du mit der Zurück-Geste. Danach öffnet er sich erst wieder,
wenn du das Handy vom Lader nimmst oder einmal hochkant drehst.

### Optional: Samsung „Modi und Routinen“

Die App braucht Routinen nicht, kann aber zusätzlich so ausgelöst werden:
Routine *Wenn: Ladestatus = Kabelloses Laden* → *Dann: App öffnen* → „StandBy“
(die Standby-Activity ist dafür exportiert). Die eingebaute Automatik ist zuverlässiger,
weil Routinen keine Lage-Erkennung (Querformat) als Bedingung haben.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `StandbyActivity.kt` | WebView mit der Web-App aus den Assets, Vollbild, Querformat, `showWhenLocked` + `turnScreenOn` |
| `StandbyMonitorService.kt` | Vordergrund-Dienst: Ladetyp (kabellos), Sperrstatus, startet/beendet den Standby |
| `OrientationDetector.kt` | Querformat über den Lagesensor (Display-Rotation ist bei gesperrtem Handy nicht nutzbar) |
| `MainActivity.kt` | Einrichtung, Berechtigungen, Live-Status |
| `BootReceiver.kt` | Startet die Überwachung nach Neustart/Update neu |
