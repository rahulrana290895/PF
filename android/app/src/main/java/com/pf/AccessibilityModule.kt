package com.pf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.os.Environment
import java.io.File
import android.util.Log
import android.media.MediaScannerConnection
import android.content.Intent
import android.net.Uri
import java.net.URLEncoder

class AccessibilityModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AccessibilityModule"
    }

    // 🔥 START BULK (image hai ya nahi batayega)
    @ReactMethod
    fun startBulk(isImage: Boolean) {
        Log.d("ACC_SAVED", "Bulk Started | ImageFlow: $isImage")
        MyAccessibilityService.startBulk(isImage)
    }

    // 🔥 STOP BULK
    @ReactMethod
    fun stopBulk() {
        Log.d("ACC_SAVED", "Bulk Stopped")
        MyAccessibilityService.stopBulk()
    }

    // 🔥 SAVE IMAGE TO GALLERY (IMPORTANT)
    @ReactMethod
    fun saveImageToGallery(imageUri: String) {
        val context = reactApplicationContext
        try {
            val inputStream = context.contentResolver.openInputStream(android.net.Uri.parse(imageUri))
            val file = File(
                Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES),
                "wa_bulk_image.jpg"
            )
            val outputStream = file.outputStream()
            inputStream?.copyTo(outputStream)
            inputStream?.close()
            outputStream.close()
            // 🔥 IMPORTANT LINE (Gallery refresh)
            MediaScannerConnection.scanFile(
                context,
                arrayOf(file.absolutePath),
                arrayOf("image/jpeg"),
                null
            )
            Log.d("ACC", "Image saved & scanned")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun openWhatsApp(number: String, message: String, type: String) {
        try {
            val packageName = if (type == "BUSINESS") {
                "com.whatsapp.w4b"
            } else {
                "com.whatsapp"
            }

            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse("https://wa.me/$number?text=${URLEncoder.encode(message, "UTF-8")}")
            intent.setPackage(packageName)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

            reactApplicationContext.startActivity(intent)

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}