package com.pf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AccessibilityModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AccessibilityModule"
    }

    @ReactMethod
    fun startBulk() {
        MyAccessibilityService.startBulk()
    }

    @ReactMethod
    fun stopBulk() {
        MyAccessibilityService.stopBulk()
    }
}