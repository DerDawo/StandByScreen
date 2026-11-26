plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

// Die Web-App (index.html, script.js, components/, src/ ...) liegt im Repo-Root
// und bleibt die einzige Quelle. Beim Build wird sie in die APK-Assets kopiert.
val webRoot = rootDir.parentFile
val webAssetsDir = layout.buildDirectory.dir("generated/webassets")

val copyWebAssets by tasks.registering(Sync::class) {
    from(webRoot) {
        include("index.html", "script.js", "styles.css", "manifest.json")
        include("components/**", "src/**", "images/**")
    }
    into(webAssetsDir.map { it.dir("web") })
}

android {
    namespace = "de.derdawo.standbyscreen"
    compileSdk = 35

    defaultConfig {
        applicationId = "de.derdawo.standbyscreen"
        minSdk = 26
        targetSdk = 35
        versionCode = (System.getenv("GITHUB_RUN_NUMBER") ?: "1").toInt()
        versionName = "1.0.0"
    }

    signingConfigs {
        // Fester Debug-Schlüssel im Repo, damit jede CI-APK als Update über die
        // vorherige installiert werden kann (kein Geheimnis, Passwort "android").
        getByName("debug") {
            storeFile = file("debug.keystore")
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
    }

    buildTypes {
        debug {
            signingConfig = signingConfigs.getByName("debug")
        }
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    sourceSets["main"].assets.srcDir(webAssetsDir)

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

tasks.named("preBuild") { dependsOn(copyWebAssets) }

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.webkit:webkit:1.12.1")
}
