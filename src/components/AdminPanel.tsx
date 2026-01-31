import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Make sure this path points to your supabase file

export default function AdminPanel() {
  // --- STATE VARIABLES ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // For adding new users
  const [newPassword, setNewPassword] = useState(''); // For adding new users
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // --- CONFIGURATION ---
  const MASTER_PASSWORD = "admin123"; // 🔴 CHANGE THIS TO YOUR SECRET PASSWORD

  // --- CHECK LOGIN ON LOAD ---
  useEffect(() => {
    // Check if user already logged in previously
    const loggedIn = localStorage.getItem('nexus_admin_logged_in');
    if (loggedIn === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // --- LOGIN FUNCTION (NO OTP) ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password === MASTER_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('nexus_admin_logged_in', 'true'); // Keep logged in
    } else {
      alert("❌ ACCESS DENIED: Incorrect Password");
    }
  };

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('nexus_admin_logged_in');
  };

  // --- ADD NEW USER FUNCTION ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // This creates a user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: `✅ User ${email} created successfully!` });
      setEmail('');
      setNewPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER: LOGIN SCREEN (If not admin) ---
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Nexus Vault</h2>
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Master Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter access code..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
            >
              Unlock Vault
            </button>
          </form>
          
          <p className="mt-4 text-xs text-center text-gray-600">
            Authorized Personnel Only.
          </p>
        </div>
      </div>
    );
  }

  // --- RENDER: ADMIN DASHBOARD (If admin) ---
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            NexusCampaign Admin
          </h1>
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white underline"
          >
            Logout
          </button>
        </div>

        {/* CREATE USER CARD */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Add New Team Member</h3>
          
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Employee Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
            <input
              type="password"
              placeholder="Assign Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
            
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-all disabled:opacity-50"
            >
              {loading ? "Creating User..." : "+ Add User to Database"}
            </button>
          </form>

          {/* STATUS MESSAGES */}
          {message && (
            <div className={`mt-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
              {message.text}
            </div>
          )}
        </div>

        {/* SECTION FOR LIST OF USERS (Placeholder) */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Database Status</h3>
          <p className="text-gray-500">System is active and accepting connections.</p>
        </div>
      </div>
    </div>
  );
}