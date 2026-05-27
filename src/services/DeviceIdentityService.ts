import { registerPlugin } from '@capacitor/core';

export interface DeviceIdentityResult {
  deviceFingerprint: string;
  publicKey: string;
  trustedDeviceId: string;
}

export interface SignChallengeResult {
  signature: string;
}

export interface GetIdentityResult {
  hasIdentity: boolean;
  publicKey?: string;
}

export interface DeviceIdentityPlugin {
  generateIdentity(): Promise<DeviceIdentityResult>;
  signChallenge(options: { nonce: string }): Promise<SignChallengeResult>;
  getIdentity(): Promise<GetIdentityResult>;
}

const DeviceIdentity = registerPlugin<DeviceIdentityPlugin>('DeviceIdentity', {
  web: () => import('./DeviceIdentityWeb').then(m => new m.DeviceIdentityWeb()),
});

export { DeviceIdentity };
