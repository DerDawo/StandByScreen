package de.derdawo.standbyscreen

import android.Manifest
import android.app.Activity
import android.app.NotificationManager
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.provider.Settings
import android.util.TypedValue
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.Switch
import android.widget.TextView

/**
 * Einrichtungsseite: automatischen Standby einschalten, nötige Berechtigungen erteilen,
 * Live-Diagnose (Laden / Querformat / gesperrt) und Standby manuell öffnen.
 */
class MainActivity : Activity() {

    private lateinit var prefs: Prefs
    private lateinit var content: LinearLayout
    private lateinit var statusText: TextView
    private val handler = Handler(Looper.getMainLooper())
    private val ticker = object : Runnable {
        override fun run() {
            updateStatus()
            handler.postDelayed(this, 1000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = Prefs(this)
        StandbyMonitorService.ensureChannels(this)

        content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(32), dp(20), dp(32))
        }
        setContentView(ScrollView(this).apply {
            setBackgroundColor(Color.BLACK)
            fitsSystemWindows = true
            addView(content)
        })
        build()
    }

    override fun onResume() {
        super.onResume()
        build()
        if (prefs.autoStandbyEnabled && !StandbyStatus.serviceRunning) StandbyMonitorService.start(this)
        handler.post(ticker)
    }

    override fun onPause() {
        handler.removeCallbacks(ticker)
        super.onPause()
    }

    private fun build() {
        content.removeAllViews()

        content.addView(text("StandBy", 34f, bold = true))
        content.addView(text(
            "Lädt dein Handy kabellos, steht es im Querformat und ist es gesperrt, " +
                "erscheint automatisch der Standby-Bildschirm.", 15f, Color.LTGRAY, top = 8
        ))

        content.addView(Button(this).apply {
            text = "Standby jetzt öffnen"
            setOnClickListener { startActivity(StandbyActivity.intent(this@MainActivity, automatic = false)) }
        }, lp(top = 20))

        section("Automatik")
        content.addView(switch("Automatischer Standby", prefs.autoStandbyEnabled) { on ->
            prefs.autoStandbyEnabled = on
            if (on) StandbyMonitorService.start(this) else StandbyMonitorService.stop(this)
        })
        content.addView(switch("Nur wenn gesperrt", prefs.onlyWhenLocked) { prefs.onlyWhenLocked = it })
        content.addView(switch("Auch beim Laden per Kabel", prefs.allowWiredCharging) { prefs.allowWiredCharging = it })

        section("Berechtigungen")
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= 33) {
            permissionRow(
                "Benachrichtigungen",
                "Nötig für die Überwachung im Hintergrund.",
                checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
            ) { requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1) }
        }
        permissionRow(
            "Über anderen Apps anzeigen",
            "Erlaubt das Öffnen des Standby aus dem Hintergrund (zuverlässigster Weg).",
            Settings.canDrawOverlays(this)
        ) {
            startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")))
        }
        if (Build.VERSION.SDK_INT >= 34) {
            permissionRow(
                "Vollbild-Benachrichtigungen",
                "Ersatzweg, um den Standby im Sperrbildschirm zu starten.",
                nm.canUseFullScreenIntent()
            ) {
                startActivity(Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT, Uri.parse("package:$packageName")))
            }
        }
        val pm = getSystemService(PowerManager::class.java)
        permissionRow(
            "Akku-Optimierung aus",
            "Verhindert, dass Samsung die Überwachung beendet.",
            pm.isIgnoringBatteryOptimizations(packageName)
        ) {
            @Suppress("BatteryLife")
            startActivity(Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:$packageName")))
        }

        section("Samsung-Tipp")
        content.addView(text(
            "Einstellungen › Akku › Hintergrundnutzungslimits › \"Nie in Standby versetzte Apps\" › StandByScreen hinzufügen. " +
                "Sonst kann One UI die Überwachung nach einiger Zeit stoppen.", 14f, Color.LTGRAY, top = 4
        ))

        section("Live-Status")
        statusText = text("", 14f, Color.LTGRAY, top = 4).apply { typeface = Typeface.MONOSPACE }
        content.addView(statusText)
        updateStatus()
    }

    private fun updateStatus() {
        if (!::statusText.isInitialized) return
        fun yn(b: Boolean) = if (b) "ja" else "nein"
        val s = StandbyStatus
        statusText.text = buildString {
            appendLine("Überwachung läuft: ${yn(s.serviceRunning)}")
            appendLine("Lädt:              ${yn(s.charging)}")
            appendLine("Kabellos:          ${yn(s.wireless)}")
            appendLine("Querformat:        ${yn(s.landscape)}")
            appendLine("Gesperrt:          ${yn(s.locked)}")
            appendLine("Sensor:            ${s.gravity}")
            append("Letztes Ereignis:  ${s.lastEvent}")
        }
    }

    // ---- kleine UI-Helfer ----

    private fun section(title: String) {
        content.addView(text(title.uppercase(), 13f, Color.rgb(255, 149, 5), bold = true, top = 28))
    }

    private fun permissionRow(title: String, desc: String, granted: Boolean, onClick: () -> Unit) {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dp(10), 0, dp(10))
        }
        val texts = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        texts.addView(text((if (granted) "✓ " else "✗ ") + title, 16f, if (granted) Color.WHITE else Color.rgb(255, 120, 120)))
        texts.addView(text(desc, 13f, Color.GRAY))
        row.addView(texts, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))
        if (!granted) {
            row.addView(Button(this).apply { text = "Erlauben"; setOnClickListener { onClick() } })
        }
        content.addView(row)
    }

    private fun switch(label: String, checked: Boolean, onChange: (Boolean) -> Unit) =
        Switch(this).apply {
            text = label
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 16f)
            isChecked = checked
            setPadding(0, dp(10), 0, dp(10))
            setOnCheckedChangeListener { _, on -> onChange(on) }
        }

    private fun text(s: String, sp: Float, color: Int = Color.WHITE, bold: Boolean = false, top: Int = 0) =
        TextView(this).apply {
            text = s
            setTextColor(color)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, sp)
            if (bold) setTypeface(typeface, Typeface.BOLD)
            if (top > 0) layoutParams = lp(top = top)
        }

    private fun lp(top: Int = 0) = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
    ).apply { topMargin = dp(top) }

    private fun dp(v: Int) = (v * resources.displayMetrics.density).toInt()

}
