'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';

// 🟢 1. Define the Prop Type here
interface LoginProps {
  onLoginSuccess?: (user: any) => void; 
}

// 🟢 2. Accept the prop in the function argument
export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  
  const router = useRouter(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      console.log("Login Successful:", data);
      
      // 🟢 3. If parent provided a callback, use it. Otherwise, redirect.
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      } else {
        router.push('/dashboard');
      }

    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String((error as { message: unknown }).message);
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      
      {/* ERROR ALERT */}
      {message && (
        <div className="fixed top-5 bg-gray-900 border border-red-800 text-red-400 px-6 py-4 rounded-lg shadow-xl z-50">
          <p className="text-sm font-mono">Error: {message.text}</p>
        </div>
      )}

      {/* MAIN LOGIN CARD */}
      <div className="w-full max-w-[350px] flex flex-col gap-6">
        
        {/* TOP BOX */}
        <div className="border border-[#363636] bg-black p-10 flex flex-col items-center">
          
          <h1 className="text-4xl font-serif italic mb-8 tracking-tighter">
            Nexus<span className="text-gray-400">Campaign</span>
          </h1>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
            
            <div className="relative group">
              <input
                type="email"
                placeholder="Phone number, username, or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-[#363636] rounded-[3px] px-3 py-[9px] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-all"
                required
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] border border-[#363636] rounded-[3px] px-3 py-[9px] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold text-sm py-1.5 rounded-[8px] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <div className="flex items-center my-3 w-full">
              <div className="h-px bg-[#363636] flex-1"></div>
              <span className="px-4 text-[13px] text-gray-400 font-semibold uppercase">OR</span>
              <div className="h-px bg-[#363636] flex-1"></div>
            </div>

            <button type="button" className="text-xs text-[#0095F6] hover:text-white transition-colors mt-2">
              Forgot password?
            </button>
          </form>
        </div>

        {/* BOTTOM BOX */}
        <div className="border border-[#363636] bg-black p-5 text-center">
          <p className="text-sm text-gray-400">
            Authorized Personnel Only. <br/>
            <span className="text-white text-xs">Contact Admin for access.</span>
          </p>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-2">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Powered by TapInfi
          </p>
        </div>
      </div>
    </div>
  );
}