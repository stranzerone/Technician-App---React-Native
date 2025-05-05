package com.sumasamu.isocietyManagerAdmin

import android.app.Application
import com.onesignal.OneSignal
import com.onesignal.debug.LogLevel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class ApplicationClass : Application() {
    override fun onCreate() {
        super.onCreate()

        // Enable verbose logging for debugging (remove in production)
        OneSignal.Debug.logLevel = LogLevel.VERBOSE
        
        // Initialize OneSignal with your App ID
        OneSignal.initWithContext(this, "YOUR_APP_ID")

        // Request push notification permissions
        CoroutineScope(Dispatchers.IO).launch {
            OneSignal.Notifications.requestPermission(true)
        }
    }
}
