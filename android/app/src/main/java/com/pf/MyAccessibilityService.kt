package com.pf

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class MyAccessibilityService : AccessibilityService() {

    companion object {
        var bulkRunning = false

        fun startBulk() {
            bulkRunning = true
        }

        fun stopBulk() {
            bulkRunning = false
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {

        // ❌ agar bulk band hai to kuch mat karo
        if (!bulkRunning) return

        if (event == null) return

        val packageName = event.packageName?.toString() ?: return

        if (packageName != "com.whatsapp" && packageName != "com.whatsapp.w4b") {
            return
        }

        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED) {
            return
        }

        val rootNode = rootInActiveWindow ?: return

        Log.d("ACC", "WhatsApp detected")

        clickSendButton(rootNode)
    }

    override fun onInterrupt() {}

    private fun clickSendButton(node: AccessibilityNodeInfo?): Boolean {

        if (node == null) return false

        val sendNodes = node.findAccessibilityNodeInfosByViewId("com.whatsapp:id/send")
        val businessSendNodes = node.findAccessibilityNodeInfosByViewId("com.whatsapp.w4b:id/send")

        if (sendNodes.isNotEmpty()) {

            sendNodes[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)

            Log.d("ACC", "Send clicked")

            Thread.sleep(1000)

            performGlobalAction(GLOBAL_ACTION_BACK)
            Thread.sleep(1000)
            performGlobalAction(GLOBAL_ACTION_BACK)

            return true
        }

        if (businessSendNodes.isNotEmpty()) {

            businessSendNodes[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)

            Log.d("ACC", "Send clicked")

            Thread.sleep(1000)

            performGlobalAction(GLOBAL_ACTION_BACK)
            Thread.sleep(1000)
            performGlobalAction(GLOBAL_ACTION_BACK)

            return true
        }

        for (i in 0 until node.childCount) {

            val result = clickSendButton(node.getChild(i))

            if (result) return true
        }

        return false
    }
}