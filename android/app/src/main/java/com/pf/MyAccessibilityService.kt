package com.pf

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class MyAccessibilityService : AccessibilityService() {

    companion object {
        var bulkRunning = false
        var isImageFlow = false
        var step = 0

        var selectedWhatsapp = "WHATSAPP"

        fun startBulk(imageFlow: Boolean) {
            bulkRunning = true
            isImageFlow = imageFlow
            step = 0
        }

        fun stopBulk() {
            bulkRunning = false
            isImageFlow = false
            step = 0
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {

        if (!bulkRunning || event == null) return

        val pkg = event.packageName?.toString() ?: return
        if (pkg != "com.whatsapp" && pkg != "com.whatsapp.w4b") return

        val root = rootInActiveWindow ?: return

        try {

            // 🔥 INVALID POPUP DETECT
            if (detectInvalidPopup(root)) return

            // 🔥 TEXT FLOW
            if (!isImageFlow) {
                clickSend(root)
                return
            }

            // 🔥 IMAGE FLOW
            handleImageFlow(root)

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onInterrupt() {}

    // ================= INVALID POPUP =================
    private fun detectInvalidPopup(root: AccessibilityNodeInfo): Boolean {

        val texts = listOf(
            "not on whatsapp",
            "invalid",
            "isn't on whatsapp",
            "नहीं है",
            "अमान्य"
        )

        for (text in texts) {
            val nodes = root.findAccessibilityNodeInfosByText(text)
            Log.d("WHATSAPP_ERROR", "Found nodes: ${nodes}")
            if (nodes.isNotEmpty()) {

                Log.d("WHATSAPP_ERROR", "❌ Invalid number detected")

                val okBtn = root.findAccessibilityNodeInfosByText("OK")
                    .ifEmpty { root.findAccessibilityNodeInfosByText("ठीक है") }

                if (okBtn.isNotEmpty()) {
                    okBtn[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)
                } else {
                    performGlobalAction(GLOBAL_ACTION_BACK)
                }

                Thread.sleep(800)
                performGlobalAction(GLOBAL_ACTION_BACK)

                step = 0
                return true
            }
        }

        return false
    }

    // ================= TEXT SEND =================
    private fun clickSend(node: AccessibilityNodeInfo?) {

        if (node == null) return

        val send = node.findAccessibilityNodeInfosByViewId("com.whatsapp:id/send")
            .ifEmpty {
                node.findAccessibilityNodeInfosByViewId("com.whatsapp.w4b:id/send")
            }

        if (send.isNotEmpty()) {

            send[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)
            Log.d("ACC", "✅ Text Sent")

            Thread.sleep(800)

            performGlobalAction(GLOBAL_ACTION_BACK)
            Thread.sleep(600)
            performGlobalAction(GLOBAL_ACTION_BACK)
        }
    }

    // ================= IMAGE FLOW =================
    private fun handleImageFlow(root: AccessibilityNodeInfo) {

        when (step) {

            // STEP 0 → Attach
            0 -> {
                val attach = root.findAccessibilityNodeInfosByViewId("com.whatsapp:id/input_attach_button")
                    .ifEmpty {
                        root.findAccessibilityNodeInfosByViewId("com.whatsapp.w4b:id/input_attach_button")
                    }

                if (attach.isNotEmpty()) {
                    attach[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)
                    Log.d("ACC", "📎 Attach")
                    step = 1
                    Thread.sleep(1000)
                }
            }

            // STEP 1 → Gallery
            1 -> {

                val gallery = root.findAccessibilityNodeInfosByText("Gallery")
                    .ifEmpty { root.findAccessibilityNodeInfosByText("गैलरी") }

                if (gallery.isNotEmpty()) {
                    gallery[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)
                    Log.d("ACC", "🖼 Gallery")
                    step = 2
                    Thread.sleep(1500)
                    return
                }
            }

            // STEP 2 → Select Image
            2 -> {

                if (clickFirstImage(root)) {
                    Log.d("ACC", "🖼 Image Selected")
                    step = 3
                    Thread.sleep(1500)
                }
            }

            // STEP 3 → Send Image
            3 -> {

                if (clickSendButton(root)) {
                    Log.d("ACC", "✅ Image Sent")

                    Thread.sleep(800)

                    performGlobalAction(GLOBAL_ACTION_BACK)
                    Thread.sleep(600)
                    performGlobalAction(GLOBAL_ACTION_BACK)

                    step = 0
                }
            }
        }
    }

    // ================= IMAGE SELECT =================
    private fun clickFirstImage(node: AccessibilityNodeInfo?): Boolean {

        if (node == null) return false

        if (node.className != null &&
            node.className.toString().contains("ImageView") &&
            node.isClickable
        ) {
            node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            return true
        }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            if (clickFirstImage(child)) return true
        }

        return false
    }

    // ================= SEND BUTTON =================
    private fun clickSendButton(node: AccessibilityNodeInfo?): Boolean {

        if (node == null) return false

        val desc = node.contentDescription?.toString()?.lowercase()
        if (desc != null && (desc.contains("send") || desc.contains("भेज"))) {
            node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            return true
        }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            if (clickSendButton(child)) return true
        }

        return false
    }
}