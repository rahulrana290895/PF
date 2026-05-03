package com.pf

import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import android.telephony.SmsManager


class SmsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SmsModule"
    }

    @ReactMethod
    fun setWhatsappType(type: String) {
        MyAccessibilityService.selectedWhatsapp = type
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

    @ReactMethod
    fun sendBulkSMS(numbers: ReadableArray, message: String, simId: Int, promise: Promise) {

        val smsManager = SmsManager.getSmsManagerForSubscriptionId(simId)
        val handler = android.os.Handler(android.os.Looper.getMainLooper())

        try {
            for (i in 0 until numbers.size()) {
                val number = numbers.getString(i)

                if (!number.isNullOrEmpty()) {

                    handler.postDelayed({

                        try {
                            val cleanMsg = message.replace("\n", " ").trim()

                            val parts = smsManager.divideMessage(cleanMsg)
                            smsManager.sendMultipartTextMessage(number, null, parts, null, null)

                            Log.d("BULK_SMS", "✅ Sent via SIM $simId to: $number")

                            if (i == numbers.size() - 1) {
                                promise.resolve("DONE")
                            }

                        } catch (e: Exception) {
                            Log.e("BULK_SMS", "❌ Failed for $number: ${e.message}")
                        }

                    }, (i * 2000).toLong())
                }
            }

        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }


    @ReactMethod
    fun getAvailableSims(promise: Promise) {
        try {
            val subManager = reactApplicationContext
                .getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as android.telephony.SubscriptionManager

            val telephonyManager = reactApplicationContext
                .getSystemService(Context.TELEPHONY_SERVICE) as android.telephony.TelephonyManager

            val list = subManager.activeSubscriptionInfoList
            val result = Arguments.createArray()

            if (list != null) {
                for (info in list) {

                    val simManager = telephonyManager.createForSubscriptionId(info.subscriptionId)

                    val simState = simManager.simState

                    val map = Arguments.createMap()
                    map.putInt("id", info.subscriptionId)
                    map.putString("name", info.displayName.toString())

                    // ✅ status bhejo
                    if (simState == android.telephony.TelephonyManager.SIM_STATE_READY) {
                        map.putString("status", "ACTIVE")
                    } else {
                        map.putString("status", "NO_NETWORK")
                    }

                    result.pushMap(map)
                }
            }

            promise.resolve(result)

        } catch (e: Exception) {
            promise.reject("SIM_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getInstalledWhatsApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val result = Arguments.createMap()

            // ✅ Normal WhatsApp
            val isWhatsappInstalled = try {
                pm.getPackageInfo("com.whatsapp", 0)
                true
            } catch (e: Exception) {
                false
            }

            // ✅ WhatsApp Business
            val isBusinessInstalled = try {
                pm.getPackageInfo("com.whatsapp.w4b", 0)
                true
            } catch (e: Exception) {
                false
            }

            result.putBoolean("whatsapp", isWhatsappInstalled)
            result.putBoolean("business", isBusinessInstalled)

            promise.resolve(result)

        } catch (e: Exception) {
            promise.reject("WA_ERROR", e.message)
        }
    }
}