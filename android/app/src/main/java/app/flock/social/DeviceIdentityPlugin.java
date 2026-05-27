package app.flock.social;

import android.content.Context;
import android.os.Build;
import android.provider.Settings;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.util.UUID;

@CapacitorPlugin(name = "DeviceIdentity")
public class DeviceIdentityPlugin extends Plugin {

    private static final String ALIAS = "FlockIdentityKey";
    private static final String ANDROID_KEYSTORE = "AndroidKeyStore";
    // NOTE: Android Keystore Ed25519 requires API 33+. Using EC for wider compatibility while meeting the requirement of hardware-backed key.
    // If strict Ed25519 is mandatory across all versions, a custom provider (like Tink or BouncyCastle) would be required, or minSdk=33.
    // For this demonstration, we'll use EC (which is standard and hardware-backed on most Androids) but we can simulate the API shape.

    @PluginMethod
    public void generateIdentity(PluginCall call) {
        try {
            Context context = getContext();

            // 1. Generate Device Fingerprint
            String androidId = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
            String model = Build.MODEL;
            String osVersion = Build.VERSION.RELEASE;
            String installationId = UUID.randomUUID().toString(); // In a real app, persist this
            long timestamp = System.currentTimeMillis();

            String rawFingerprint = androidId + model + osVersion + installationId + timestamp;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawFingerprint.getBytes(StandardCharsets.UTF_8));
            String deviceFingerprint = Base64.encodeToString(hashBytes, Base64.NO_WRAP);

            // 2. Generate Hardware-backed KeyPair
            KeyPairGenerator kpg = KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_EC, ANDROID_KEYSTORE);
            KeyGenParameterSpec parameterSpec = new KeyGenParameterSpec.Builder(
                    ALIAS,
                    KeyProperties.PURPOSE_SIGN | KeyProperties.PURPOSE_VERIFY)
                    .setDigests(KeyProperties.DIGEST_SHA256)
                    .setUserAuthenticationRequired(false) // Set to true if biometrics are needed
                    .build();

            kpg.initialize(parameterSpec);
            KeyPair keyPair = kpg.generateKeyPair();
            PublicKey publicKey = keyPair.getPublic();

            String publicKeyBase64 = Base64.encodeToString(publicKey.getEncoded(), Base64.NO_WRAP);
            String trustedDeviceId = UUID.randomUUID().toString();

            JSObject ret = new JSObject();
            ret.put("deviceFingerprint", deviceFingerprint);
            ret.put("publicKey", publicKeyBase64);
            ret.put("trustedDeviceId", trustedDeviceId);

            call.resolve(ret);

        } catch (Exception e) {
            call.reject("Error generating identity", e);
        }
    }

    @PluginMethod
    public void signChallenge(PluginCall call) {
        try {
            String nonce = call.getString("nonce");
            if (nonce == null) {
                call.reject("Nonce is required");
                return;
            }

            KeyStore keyStore = KeyStore.getInstance(ANDROID_KEYSTORE);
            keyStore.load(null);
            PrivateKey privateKey = (PrivateKey) keyStore.getKey(ALIAS, null);

            if (privateKey == null) {
                call.reject("Key not found in Keystore");
                return;
            }

            Signature signature = Signature.getInstance("SHA256withECDSA");
            signature.initSign(privateKey);
            signature.update(nonce.getBytes(StandardCharsets.UTF_8));
            byte[] signatureBytes = signature.sign();

            String signatureBase64 = Base64.encodeToString(signatureBytes, Base64.NO_WRAP);

            JSObject ret = new JSObject();
            ret.put("signature", signatureBase64);
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("Error signing challenge", e);
        }
    }

    @PluginMethod
    public void getIdentity(PluginCall call) {
        try {
            KeyStore keyStore = KeyStore.getInstance(ANDROID_KEYSTORE);
            keyStore.load(null);
            if (keyStore.containsAlias(ALIAS)) {
                PublicKey publicKey = keyStore.getCertificate(ALIAS).getPublicKey();
                String publicKeyBase64 = Base64.encodeToString(publicKey.getEncoded(), Base64.NO_WRAP);

                JSObject ret = new JSObject();
                ret.put("hasIdentity", true);
                ret.put("publicKey", publicKeyBase64);
                call.resolve(ret);
            } else {
                JSObject ret = new JSObject();
                ret.put("hasIdentity", false);
                call.resolve(ret);
            }
        } catch (Exception e) {
             call.reject("Error checking identity", e);
        }
    }
}