package de.derdawo.standbyscreen

import android.content.Context

/** Native Einstellungen der App (die Uhr-Einstellungen selbst liegen in der Web-App). */
class Prefs(context: Context) {
    private val sp = context.getSharedPreferences("standby_prefs", Context.MODE_PRIVATE)

    /** Automatischer Standby (Hintergrund-Überwachung) eingeschaltet. */
    var autoStandbyEnabled: Boolean
        get() = sp.getBoolean("auto_enabled", false)
        set(v) = sp.edit().putBoolean("auto_enabled", v).apply()

    /** Nur auslösen, wenn das Handy gesperrt ist. */
    var onlyWhenLocked: Boolean
        get() = sp.getBoolean("only_locked", true)
        set(v) = sp.edit().putBoolean("only_locked", v).apply()

    /** Auch bei Kabel-Laden auslösen (Standard: nur kabellos/Induktion). */
    var allowWiredCharging: Boolean
        get() = sp.getBoolean("allow_wired", false)
        set(v) = sp.edit().putBoolean("allow_wired", v).apply()
}

/** Live-Status für die Diagnose-Anzeige in der Einrichtungs-Seite. */
object StandbyStatus {
    @Volatile var serviceRunning = false
    @Volatile var charging = false
    @Volatile var wireless = false
    @Volatile var landscape = false
    @Volatile var locked = false
    @Volatile var gravity = "–"
    @Volatile var lastEvent = "–"
}
