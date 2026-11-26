package de.derdawo.standbyscreen

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Startet die Überwachung nach einem Neustart oder App-Update wieder. */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED || intent.action == Intent.ACTION_MY_PACKAGE_REPLACED) {
            if (Prefs(context).autoStandbyEnabled) {
                runCatching { StandbyMonitorService.start(context) }
            }
        }
    }
}
