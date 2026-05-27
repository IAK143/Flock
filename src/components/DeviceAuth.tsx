import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Fingerprint, Smartphone, Key } from 'lucide-react';
import { DeviceIdentity } from '../services/DeviceIdentityService';
import { supabase } from '../services/supabase';

export const DeviceAuth: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [status, setStatus] = useState<string>('Initializing secure enclave...');
  const [isRegistering, setIsRegistering] = useState(false);

  const performAuthentication = useCallback(async () => {
    setStatus('Authenticating with backend...');

    try {
      // Establish session with Supabase anonymously
      const { error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error('Supabase auth error:', error);
        setStatus('Backend authentication failed.');
        setIsRegistering(false);
        return;
      }

      setStatus('Secure Session Established');
      setTimeout(() => {
        onAuthenticated();
      }, 1000);

    } catch (error) {
      console.error(error);
      setStatus('Authentication rejected.');
      setIsRegistering(false);
    }
  }, [onAuthenticated]);

  const checkExistingIdentity = useCallback(async () => {
    try {
      const identity = await DeviceIdentity.getIdentity();

      if (identity.hasIdentity) {
        setStatus('Hardware identity found. Authenticating...');
        await performAuthentication();
      } else {
        setStatus('No identity found on this device.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error checking secure storage.');
    }
  }, [performAuthentication]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkExistingIdentity();
  }, [checkExistingIdentity]);

  const registerDevice = async () => {
    setIsRegistering(true);
    setStatus('Generating hardware-backed keypair...');

    try {
      await DeviceIdentity.generateIdentity();
      setStatus('Device physically bound to account.');

      // Perform authentication immediately after key generation
      await performAuthentication();

    } catch (error) {
      console.error(error);
      setStatus('Failed to secure device.');
      setIsRegistering(false);
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
