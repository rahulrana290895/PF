package com.pf

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.provider.CallLog
import android.telephony.TelephonyManager
import android.util.Log
import android.telephony.SmsManager

class CallReceiver : BroadcastReceiver() {

    private var lastState = TelephonyManager.CALL_STATE_IDLE
    private var isIncoming = false

    override fun onReceive(context: Context, intent: Intent) {

        val stateStr = intent.getStringExtra(TelephonyManager.EXTRA_STATE)

        val state = when (stateStr) {
            TelephonyManager.EXTRA_STATE_IDLE -> TelephonyManager.CALL_STATE_IDLE
            TelephonyManager.EXTRA_STATE_OFFHOOK -> TelephonyManager.CALL_STATE_OFFHOOK
            TelephonyManager.EXTRA_STATE_RINGING -> TelephonyManager.CALL_STATE_RINGING
            else -> return
        }

        val prefs = context.getSharedPreferences("sms_templates", Context.MODE_PRIVATE)

        val incomingMsg = prefs.getString("incoming", "")
        val outgoingMsg = prefs.getString("outgoing", "")
        val missedMsg = prefs.getString("missed", "")

        when (state) {

            // 📞 Incoming Call
            TelephonyManager.CALL_STATE_RINGING -> {
                isIncoming = true
                Log.e("CALL_DETECT", "📞 Incoming Call Ringing")
            }

            // 📤 Outgoing Call
            TelephonyManager.CALL_STATE_OFFHOOK -> {
                if (lastState != TelephonyManager.CALL_STATE_RINGING) {
                    isIncoming = false
                    Log.e("CALL_DETECT", "📤 Outgoing Call Started")
                } else {
                    Log.e("CALL_DETECT", "✅ Incoming Call Answered")
                }
            }

            // 📴 Call End / Missed
            TelephonyManager.CALL_STATE_IDLE -> {

                Handler(Looper.getMainLooper()).postDelayed({

                    val callDetails = getLastCallDetails(context)

                    val number = callDetails.first
                    val type = callDetails.second

                    when (type) {

                        CallLog.Calls.MISSED_TYPE -> {
                            Log.e("CALL_TYPE", "❌ MISSED CALL")
                            Log.e("CALL_NUMBER", "Missed Number: $number")

                             sendSMS(context, missedMsg ?: "", number)
                        }

                        CallLog.Calls.INCOMING_TYPE -> {
                            Log.e("CALL_TYPE", "📞 INCOMING CALL")
                            Log.e("CALL_NUMBER", "Incoming Number: $number")

                             sendSMS(context, incomingMsg ?: "", number)
                        }

                        CallLog.Calls.OUTGOING_TYPE -> {
                            Log.e("CALL_TYPE", "📤 OUTGOING CALL")
                            Log.e("CALL_NUMBER", "Outgoing Number: $number")

                             sendSMS(context, outgoingMsg ?: "", number)
                        }
                    }

                }, 2000) // ⏱ delay important
            }
        }

        lastState = state
    }

    // 📞 Last Call Details (Number + Type)
    private fun getLastCallDetails(context: Context): Pair<String?, Int> {
        try {
            val cursor = context.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                null,
                null,
                null,
                CallLog.Calls.DATE + " DESC"
            )

            if (cursor != null && cursor.moveToFirst()) {

                val numberIndex = cursor.getColumnIndex(CallLog.Calls.NUMBER)
                val typeIndex = cursor.getColumnIndex(CallLog.Calls.TYPE)

                val number = cursor.getString(numberIndex)
                val type = cursor.getInt(typeIndex)

                cursor.close()
                return Pair(number, type)
            }

        } catch (e: Exception) {
            Log.e("CALL_LOG", "Error: ${e.message}")
        }

        return Pair(null, -1)
    }

    // 📩 SMS Function
    private fun sendSMS(context: Context, message: String, number: String?) {
        try {
            if (number == null || message.isEmpty()) return

            val cleanMsg = message.replace("\n", " ").trim()

            val smsManager = SmsManager.getDefault()

            val parts = smsManager.divideMessage(cleanMsg)
            smsManager.sendMultipartTextMessage(number, null, parts, null, null)

            Log.e("SMS_SEND", "✅ SMS Sent to $number : $cleanMsg")

        } catch (e: Exception) {
            Log.e("SMS_SEND", "❌ Failed: ${e.message}")
        }
    }
}