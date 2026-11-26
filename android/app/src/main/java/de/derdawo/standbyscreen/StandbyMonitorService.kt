package de.derdawo.standbyscreen

import android.app.KeyguardManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ServiceInfo
import android.hardware.SensorManager
import android.os.BatteryManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat

/**
 * Vordergrund-Dienst, der die drei Bedingungen überwacht:
 *  1. Handy lädt kabellos (Induktion)
 *  2. Handy steht im Querformat (Beschleunigungssensor)
 *  3. Handy ist gesperrt
 * Sind alle erfüllt, wird [StandbyActivity] über dem Sperrbildschirm geöffnet.
 * Endet das Laden oder wird das Handy hochkant gedreht, schließt sich der Standby wieder.
 */
class StandbyMonitorService : Service() {

    companion object {
        private const val TAG = "StandbyMonitor"
        const val CHANNEL_MONITOR = "monitor"
        const val CHANNEL_LAUNCH = "launch"
        const val NOTIF_MONITOR = 1
        const val NOTIF_LAUNCH = 2

        /** Wird gesetzt, wenn der Nutzer den Standby selbst geschlossen hat. Erst nach
         *  Laden-Ende oder Hochkant-Drehen wird wieder automatisch ausgelöst. */
        @Volatile var suppressedUntilReset = false

        fun start(context: Context) {
            ContextCompat.startForegroundService(context, Intent(context, StandbyMonitorService::class.java))
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, StandbyMonitorService::class.java))
        }

        fun ensureChannels(context: Context) {
            val nm = context.getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(
                NotificationChannel(CHANNEL_MONITOR, "Standby-Überwachung", NotificationManager.IMPORTANCE_MIN).apply {
                    description = "Dauerhafte Benachrichtigung, solange der automatische Standby aktiv ist."
                    setShowBadge(false)
                }
            )
            nm.createNotificationChannel(
                NotificationChannel(CHANNEL_LAUNCH, "Standby starten", NotificationManager.IMPORTANCE_HIGH).apply {
                    description = "Öffnet den Standby-Bildschirm im gesperrten Zustand."
                    setSound(null, null)
                    enableVibration(false)
                    setShowBadge(false)
                }
            )
        }
    }

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var prefs: Prefs
    private lateinit var keyguard: KeyguardManager
    private lateinit var orientation: OrientationDetector
    private var wakeLock: PowerManager.WakeLock? = null

    private var charging = false
    private var wireless = false

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            when (intent.action) {
                Intent.ACTION_BATTERY_CHANGED -> updateCharging(intent)
                Intent.ACTION_POWER_CONNECTED, Intent.ACTION_POWER_DISCONNECTED -> {
                    // ACTION_BATTERY_CHANGED liefert den genauen Ladetyp kurz danach
                    registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))?.let { updateCharging(it) }
                }
                Intent.ACTION_SCREEN_OFF, Intent.ACTION_SCREEN_ON, Intent.ACTION_USER_PRESENT -> {
                    StandbyStatus.lastEvent = intent.action!!.substringAfterLast('.')
                    // Sperre wird teils erst kurz nach SCREEN_OFF aktiv
                    handler.postDelayed({ evaluate() }, 600)
                    evaluate()
                }
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        prefs = Prefs(this)
        keyguard = getSystemService(KeyguardManager::class.java)
        orientation = OrientationDetector(getSystemService(SensorManager::class.java)) { evaluate() }
        ensureChannels(this)

        ServiceCompat.startForeground(
            this, NOTIF_MONITOR, buildMonitorNotification(),
            if (Build.VERSION.SDK_INT >= 34) ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE else 0
        )
        StandbyStatus.serviceRunning = true

        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_BATTERY_CHANGED)
            addAction(Intent.ACTION_POWER_CONNECTED)
            addAction(Intent.ACTION_POWER_DISCONNECTED)
            addAction(Intent.ACTION_SCREEN_OFF)
            addAction(Intent.ACTION_SCREEN_ON)
            addAction(Intent.ACTION_USER_PRESENT)
        }
        ContextCompat.registerReceiver(this, receiver, filter, ContextCompat.RECEIVER_NOT_EXPORTED)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (!prefs.autoStandbyEnabled) {
            stopSelf()
            return START_NOT_STICKY
        }
        evaluate()
        return START_STICKY
    }

    override fun onDestroy() {
        StandbyStatus.serviceRunning = false
        runCatching { unregisterReceiver(receiver) }
        orientation.stop()
        releaseWakeLock()
        handler.removeCallbacksAndMessages(null)
        super.onDestroy()
    }

    private fun updateCharging(intent: Intent) {
        val plugged = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0)
        val newCharging = plugged != 0
        val newWireless = plugged == BatteryManager.BATTERY_PLUGGED_WIRELESS
        if (newCharging == charging && newWireless == wireless) return
        charging = newCharging
        wireless = newWireless
        StandbyStatus.charging = charging
        StandbyStatus.wireless = wireless
        StandbyStatus.lastEvent = if (wireless) "Kabellos laden" else if (charging) "Kabel laden" else "Laden beendet"
        Log.d(TAG, "charging=$charging wireless=$wireless")

        if (qualifiesCharging()) {
            // Während des Ladens den Sensor aktiv halten (kostet kaum Akku, da am Lader)
            acquireWakeLock()
            orientation.start()
        } else {
            orientation.stop()
            releaseWakeLock()
            suppressedUntilReset = false
        }
        evaluate()
    }

    private fun qualifiesCharging() = wireless || (prefs.allowWiredCharging && charging)

    private fun evaluate() {
        val landscape = orientation.landscape
        val locked = keyguard.isKeyguardLocked
        StandbyStatus.landscape = landscape
        StandbyStatus.locked = locked

        val shouldShow = prefs.autoStandbyEnabled && qualifiesCharging() && landscape &&
            (locked || !prefs.onlyWhenLocked)

        if (!qualifiesCharging() || !landscape) suppressedUntilReset = false

        if (shouldShow) {
            if (!StandbyActivity.isShowing && !suppressedUntilReset) launchStandby()
        } else if (StandbyActivity.isShowing && StandbyActivity.startedAutomatically) {
            // Bedingungen weggefallen (Laden beendet / hochkant gedreht) -> Standby beenden.
            // Entsperren allein beendet den Standby nicht.
            if (!qualifiesCharging() || !landscape) StandbyActivity.finishCurrent()
        }
    }

    private fun launchStandby() {
        Log.d(TAG, "launching standby")
        StandbyStatus.lastEvent = "Standby gestartet"
        val intent = StandbyActivity.intent(this, automatic = true)

        // Weg 1: Mit "Über anderen Apps anzeigen" darf die App direkt aus dem Hintergrund starten.
        if (Settings.canDrawOverlays(this)) {
            try {
                startActivity(intent)
                return
            } catch (e: Exception) {
                Log.w(TAG, "direct start failed", e)
            }
        }
        // Weg 2: Vollbild-Benachrichtigung (wie ein Wecker) – startet die Activity bei gesperrtem Handy.
        val pi = PendingIntent.getActivity(
            this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val n = NotificationCompat.Builder(this, CHANNEL_LAUNCH)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("StandBy")
            .setContentText("Tippen, um den Standby-Bildschirm zu öffnen")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(pi, true)
            .setContentIntent(pi)
            .setAutoCancel(true)
            .setTimeoutAfter(60_000)
            .build()
        getSystemService(NotificationManager::class.java).notify(NOTIF_LAUNCH, n)
    }

    private fun buildMonitorNotification(): Notification {
        val pi = PendingIntent.getActivity(
            this, 1, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE
        )
        return NotificationCompat.Builder(this, CHANNEL_MONITOR)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("Automatischer Standby aktiv")
            .setContentText("Startet beim kabellosen Laden im Querformat")
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setContentIntent(pi)
            .build()
    }

    private fun acquireWakeLock() {
        if (wakeLock?.isHeld == true) return
        wakeLock = getSystemService(PowerManager::class.java)
            .newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "StandByScreen:monitor")
            .apply { setReferenceCounted(false); acquire(12 * 60 * 60 * 1000L) }
    }

    private fun releaseWakeLock() {
        wakeLock?.let { if (it.isHeld) it.release() }
        wakeLock = null
    }
}
