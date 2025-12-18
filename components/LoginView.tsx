
import React, { useState } from 'react';

interface LoginViewProps {
  onVerify: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onVerify }) => {
  const [step, setStep] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gray-50 py-20">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-[#fdbd10] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#1d4d2b]">
             <span className="text-[#1d4d2b] font-bold text-2xl">S</span>
           </div>
           <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
           <p className="text-gray-500">Sign in or create an account</p>
        </div>

        {step === 'LOGIN' ? (
          <div className="space-y-6">
            <button className="w-full bg-[#5C2D91] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              Sign in with <span className="font-black italic">shop</span>
            </button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email or phone number</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aiwithsaratamil@gmail.com"
                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setStep('OTP')}
              className="w-full bg-[#1d4d2b] text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Enter the 6-digit code sent to</p>
              <p className="font-bold text-gray-800">{email}</p>
            </div>
            <input 
              type="text" 
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none"
            />
            <button 
              onClick={onVerify}
              className="w-full bg-[#1d4d2b] text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform"
            >
              Verify OTP
            </button>
            <p className="text-center text-sm text-gray-400">Didn't receive code? <span className="text-[#1d4d2b] font-bold cursor-pointer">Resend</span></p>
          </div>
        )}
      </div>
      <div className="mt-12 flex gap-8 text-xs text-gray-400 font-medium">
        <span>Privacy policy</span>
        <span>Terms of service</span>
      </div>
    </div>
  );
};

export default LoginView;
