import { WebPlugin } from '@capacitor/core';
import type { DeviceIdentityPlugin, DeviceIdentityResult, SignChallengeResult, GetIdentityResult } from './DeviceIdentityService';

export class DeviceIdentityWeb extends WebPlugin implements DeviceIdentityPlugin {
  async generateIdentity(): Promise<DeviceIdentityResult> {
    console.warn('generateIdentity is using web mock');
    // In a real browser fallback, you might use WebCrypto API
    return {
      deviceFingerprint: 'mock-web-fingerprint-12345',
      publicKey: 'mock-web-public-key-base64',
      trustedDeviceId: 'mock-web-trusted-device-id'
    };
  }

  async signChallenge(options: { nonce: string }): Promise<SignChallengeResult> {
    console.warn('signChallenge is using web mock');
    return {
      signature: `mock-signature-for-${options.nonce}`
    };
  }

  async getIdentity(): Promise<GetIdentityResult> {
    console.warn('getIdentity is using web mock');
    return {
      hasIdentity: true,
      publicKey: 'mock-web-public-key-base64'
    };
  }
}
