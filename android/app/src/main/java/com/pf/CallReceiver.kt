package com.pf

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager
import android.util.Log

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

        when (state) {
            // Incoming call ringing
            TelephonyManager.CALL_STATE_RINGING -> {
                isIncoming = true
                Log.e("CALL_DETECT", "📞 Incoming Call Ringing")
            }

            // Call picked / outgoing started
            TelephonyManager.CALL_STATE_OFFHOOK -> {
                if (lastState != TelephonyManager.CALL_STATE_RINGING) {
                    isIncoming = false
                    Log.e("CALL_DETECT", "📤 Outgoing Call Started")
                } else {
                    Log.e("CALL_DETECT", "✅ Incoming Call Answered")
                }
            }

            // Call ended / idle
            TelephonyManager.CALL_STATE_IDLE -> {
                if (lastState == TelephonyManager.CALL_STATE_RINGING) {
                    Log.e("CALL_DETECT", "❌ Missed Call")
                } else if (isIncoming) {
                    Log.e("CALL_DETECT", "📴 Incoming Call Ended")
                } else {
                    Log.e("CALL_DETECT", "📤 Outgoing Call Ended")
                }
            }
        }

        lastState = state
    }
}