import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Fingerprint, Smartphone, Key } from 'lucide-react';
import { DeviceIdentity } from '../services/DeviceIdentityService';

export const DeviceAuth: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [status, setStatus] = useState<string>('Initializing secure enclave...');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkExistingIdentity();
  }, []);

  const checkExistingIdentity = async () => {
    try {
      const identity = await DeviceIdentity.getIdentity();

      if (identity.hasIdentity) {
        setStatus('Hardware identity found. Authenticating...');
        await performAuthentication();
      } else {
        setStatus('No identity found on this device.');
      }
    } catch (e: any) {
      setStatus('Error checking secure storage.');
    }
  };

  const registerDevice = async () => {
    setIsRegistering(true);
    setStatus('Generating hardware-backed keypair...');

    try {
      await DeviceIdentity.generateIdentity();
      setStatus('Device physically bound to account.');

      // Simulate registering with backend
      setTimeout(() => {
         performAuthentication();
      }, 1500);

    } catch (e: any) {
      setStatus('Failed to secure device.');
      setIsRegistering(false);
    }
  };

  const performAuthentication = async () => {
    setStatus('Authenticating with backend...');

    try {
      // 1. Simulate getting a nonce from backend
      const serverNonce = `nonce-${Math.random().toString(36).substring(7)}`;

      // 2. Sign challenge using hardware key
      setStatus('Signing challenge securely...');
      await DeviceIdentity.signChallenge({ nonce: serverNonce });

      // 3. Simulate backend verification
      setStatus('Backend verifying signature and fingerprint...');

      setTimeout(() => {
        setStatus('Secure Session Established');
        setTimeout(() => {
          onAuthenticated();
        }, 1000);
      }, 1000);

    } catch (e: any) {
      setStatus('Authentication rejected.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-soft-lg w-full max-w-sm flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 relative">
           <Shield className="w-10 h-10 text-accent relative z-10" />
           <div className="absolute inset-0 border-2 border-accent/20 rounded-full animate-ping" />
        </div>

        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Trusted Device</h2>
        <p className="text-sm text-gray-500 mb-8 px-4">
          {status}
        </p>

        {!isRegistering && status === 'No identity found on this device.' && (
          <button
            onClick={registerDevice}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-2xl py-4 font-medium transition-colors shadow-soft flex items-center justify-center gap-2 mb-4"
          >
            <Fingerprint className="w-5 h-5" />
            Bind Device to Account
          </button>
        )}

        {/* Security indicators */}
        <div className="w-full grid grid-cols-2 gap-3 mt-4 border-t border-gray-100 pt-6">
           <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50">
             <Key className="w-4 h-4 text-green-500" />
             <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Hardware Key</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50">
             <Smartphone className="w-4 h-4 text-green-500" />
             <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Physical Lock</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
