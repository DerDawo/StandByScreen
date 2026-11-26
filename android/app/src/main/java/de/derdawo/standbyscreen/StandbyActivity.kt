package de.derdawo.standbyscreen

import android.annotation.SuppressLint
import android.app.Activity
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebViewAssetLoader
import java.lang.ref.WeakReference

/**
 * Zeigt die bestehende Web-App (Uhren, Farbpaletten, Menüs …) aus den APK-Assets an –
 * im Vollbild, im Querformat und über dem Sperrbildschirm, ohne dass entsperrt werden muss.
 */
class StandbyActivity : Activity() {

    companion object {
        private const val EXTRA_AUTOMATIC = "automatic"
        private const val START_URL = "https://appassets.androidplatform.net/assets/web/index.html"

        @Volatile var isShowing = false
            private set
        @Volatile var startedAutomatically = false
            private set
        private var current: WeakReference<StandbyActivity>? = null

        fun intent(context: Context, automatic: Boolean) =
            Intent(context, StandbyActivity::class.java)
                .putExtra(EXTRA_AUTOMATIC, automatic)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_NO_USER_ACTION)

        fun finishCurrent() {
            current?.get()?.let { it.runOnUiThread { it.closedBySystem = true; it.finish() } }
        }
    }

    private lateinit var webView: WebView
    private var closedBySystem = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        current = WeakReference(this)
        isShowing = true // gilt bis onDestroy, damit Bildschirm-aus per Taste nicht sofort neu startet
        startedAutomatically = intent.getBooleanExtra(EXTRA_AUTOMATIC, false)

        if (Build.VERSION.SDK_INT >= 27) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        hideSystemBars()

        getSystemService(NotificationManager::class.java)
            .cancel(StandbyMonitorService.NOTIF_LAUNCH)

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this).apply {
            setBackgroundColor(Color.BLACK)
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = false
            settings.mediaPlaybackRequiresUserGesture = false
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
            overScrollMode = WebView.OVER_SCROLL_NEVER
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                    assetLoader.shouldInterceptRequest(request.url)

                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val url = request.url
                    if (url.host == "appassets.androidplatform.net") return false
                    // Externe Links (Credits) im Browser öffnen
                    runCatching { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url.toString()))) }
                    return true
                }
            }
        }
        // target="_blank"-Links ebenfalls extern öffnen
        webView.settings.setSupportMultipleWindows(false)
        setContentView(webView)
        webView.loadUrl(START_URL)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (intent.getBooleanExtra(EXTRA_AUTOMATIC, false)) startedAutomatically = true
        getSystemService(NotificationManager::class.java).cancel(StandbyMonitorService.NOTIF_LAUNCH)
    }

    override fun onResume() {
        super.onResume()
        hideSystemBars()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) hideSystemBars()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Nutzer schließt den Standby bewusst -> nicht sofort wieder öffnen
        StandbyMonitorService.suppressedUntilReset = true
        @Suppress("DEPRECATION")
        super.onBackPressed()
    }

    override fun onDestroy() {
        if (!closedBySystem && isFinishing) StandbyMonitorService.suppressedUntilReset = true
        isShowing = false
        if (current?.get() === this) current = null
        webView.destroy()
        super.onDestroy()
    }

    private fun hideSystemBars() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowInsetsControllerCompat(window, window.decorView).apply {
            hide(WindowInsetsCompat.Type.systemBars())
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        }
    }
}
