'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase'; // ✅ Corrected path based on your folder structure
import { useRouter } from 'next/navigation'; // ✅ Correct router for Next.js

export default function Login() {
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
      // 🟢 Authenticate with Password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      console.log("Login Successful:", data);
      
      // ✅ Redirect using Next.js router
      router.push('/dashboard'); 

    } catch (error: unknown) {
      // 🟢 STRICT TYPESCRIPT HANDLING (No 'any')
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

      {/* LOGIN CARD */}
      <div className="w-full max-w-md border border-gray-800 bg-black p-8 rounded-none relative">
        
        {/* LOGO / TITLE */}
        <h1 className="text-3xl font-bold text-center text-gray-400 mb-2 italic tracking-wider font-serif">
          Nexus<span className="text-gray-200">Campaign</span>
        </h1>

        <form onSubmit={handleLogin} className="space-y-3 mt-8">
          
          {/* EMAIL INPUT */}
          <div>
            <input
              type="email"
              placeholder="name@tapinfi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-600/30 border-b border-gray-600 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-gray-800 transition-colors text-sm"
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-600/30 border-b border-gray-600 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-gray-800 transition-colors text-sm"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium text-sm transition-all border border-gray-700 disabled:opacity-50 mt-4"
          >
            {loading ? "AUTHENTICATING..." : "Log in"}
          </button>

          {/* DIVIDER */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-4 text-gray-700 text-[10px] uppercase">OR</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-center">
            <button type="button" className="text-xs text-gray-600 hover:text-gray-400">
              Forgot password?
            </button>
          </div>
        </form>

        {/* RESTRICTED ACCESS NOTICE */}
        <div className="mt-6 border-t border-gray-800 pt-4 text-center">
          <p className="text-[10px] text-gray-500">
            Authorized Personnel Only. Contact Admin for access.
          </p>
        </div>
      </div>

      {/* TAPINFI FOOTER */}
      <div className="mt-16 text-center">
        <p className="text-[10px] text-gray-600 tracking-[0.1em] uppercase">
          POWERED BY
        </p>
        <p className="text-xs text-gray-500 font-bold mt-1 tracking-[0.3em] uppercase">
          T A P I N F I
        </p>
      </div>
    </div>
  );
}