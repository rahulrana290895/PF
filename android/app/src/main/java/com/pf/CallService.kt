package com.pf

import android.app.*
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat

class CallService : Service() {

    private lateinit var receiver: CallReceiver
    private val channelId = "call_service_channel"

    override fun onCreate() {
        super.onCreate()

        Log.e("CALL_DETECT", "👉 onCreate START")

        // 1️⃣ Create Notification Channel
        createNotificationChannel()

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Call Detection Active")
            .setContentText("Monitoring calls...")
            .setSmallIcon(android.R.drawable.ic_menu_call)
            .build()

        // 2️⃣ Start Foreground safely
        try {
            startForeground(1, notification)
            Log.e("CALL_DETECT", "🔥 Foreground Started")
        } catch (e: Exception) {
            Log.e("CALL_DETECT", "❌ Foreground Failed: ${e.message}")
        }

        // 3️⃣ Register CallReceiver immediately
        startCallReceiver()
    }

    private fun startCallReceiver() {
        try {
            receiver = CallReceiver()
            registerReceiver(receiver, IntentFilter("android.intent.action.PHONE_STATE"))
            Log.e("CALL_DETECT", "📡 Receiver Registered")
        } catch (e: Exception) {
            Log.e("CALL_DETECT", "❌ Receiver Error: ${e.message}")
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Call Detection Service",
                NotificationManager.IMPORTANCE_LOW
            )

            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)

            Log.e("CALL_DETECT", "📢 Channel Created")
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.e("CALL_DETECT", "👉 onStartCommand Called")
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(receiver)
            Log.e("CALL_DETECT", "❌ Receiver Unregistered")
        } catch (e: Exception) {
            Log.e("CALL_DETECT", "Receiver already removed")
        }

        Log.e("CALL_DETECT", "🛑 Service Destroyed")
    }

    override fun onBind(intent: Intent?): IBinder? = null
}