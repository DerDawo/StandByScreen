package de.derdawo.standbyscreen

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.SystemClock
import kotlin.math.abs

/**
 * Erkennt über den Beschleunigungssensor, ob das Handy physisch im Querformat steht.
 * Die Display-Rotation hilft hier nicht, weil der Bildschirm im gesperrten Zustand aus ist
 * bzw. der Sperrbildschirm im Hochformat fixiert ist.
 *
 * Querformat = Schwerkraft zeigt überwiegend entlang der X-Achse (lange Seite unten),
 * das Handy liegt also nicht flach und steht nicht hochkant.
 */
class OrientationDetector(
    private val sensorManager: SensorManager,
    private val onChange: (landscape: Boolean) -> Unit,
) : SensorEventListener {

    private val sensor: Sensor? =
        sensorManager.getDefaultSensor(Sensor.TYPE_GRAVITY)
            ?: sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

    private var running = false
    private val g = FloatArray(3)
    private var candidate: Boolean? = null
    private var candidateSince = 0L
    var landscape = false
        private set

    fun start() {
        if (running || sensor == null) return
        running = true
        candidate = null
        sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL)
    }

    fun stop() {
        if (!running) return
        running = false
        sensorManager.unregisterListener(this)
        if (landscape) {
            landscape = false
            onChange(false)
        }
    }

    override fun onSensorChanged(event: SensorEvent) {
        // Tiefpass, damit kurze Erschütterungen nicht zählen
        val a = 0.8f
        for (i in 0..2) g[i] = a * g[i] + (1 - a) * event.values[i]
        val x = abs(g[0]); val y = abs(g[1]); val z = abs(g[2])
        StandbyStatus.gravity = "x=%.1f y=%.1f z=%.1f".format(g[0], g[1], g[2])

        val nowLandscape = when {
            // klar im Querformat (auch leicht nach hinten geneigt auf einem Ladeständer)
            x > 5.0f && x > y * 1.5f && z < 8.0f -> true
            // klar hochkant oder flach liegend
            y > 5.0f && y > x * 1.2f -> false
            z > 8.5f -> false
            else -> landscape // Zwischenbereich: bisherigen Zustand halten (Hysterese)
        }

        val now = SystemClock.elapsedRealtime()
        if (nowLandscape != candidate) {
            candidate = nowLandscape
            candidateSince = now
        }
        // Zustand muss ~1,5 s stabil sein
        if (nowLandscape != landscape && now - candidateSince >= 1500) {
            landscape = nowLandscape
            onChange(landscape)
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
