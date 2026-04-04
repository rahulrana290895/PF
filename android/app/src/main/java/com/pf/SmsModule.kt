package com.pf

import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*

class SmsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SmsModule"
    }

    @ReactMethod
    fun saveTemplates(incoming: String, outgoing: String, missed: String) {

        val prefs = reactApplicationContext.getSharedPreferences("sms_templates", Context.MODE_PRIVATE)
        val editor = prefs.edit()

        editor.putString("incoming", incoming)
        editor.putString("outgoing", outgoing)
        editor.putString("missed", missed)

        editor.apply()

        // ✅ Debug log
        Log.d("SMS_DEBUG", "Incoming: $incoming")
        Log.d("SMS_DEBUG", "Outgoing: $outgoing")
        Log.d("SMS_DEBUG", "Missed: $missed")
    }

    @ReactMethod
    fun startCallService() {
        Log.d("CALL_DEBUG", "SMS Module tak chal raha hai")
        val intent = Intent(reactApplicationContext, CallService::class.java)
        reactApplicationContext.startForegroundService(intent)
    }
}