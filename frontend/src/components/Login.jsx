import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate("/");
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md p-10 bg-mischka-100 rounded-[40px] shadow-2xl shadow-mischka-200 border border-mischka-200">
            <div className="flex flex-col items-center mb-10">
                <div className="mb-6 w-24 h-24 rounded-full bg-mischka-50 border-4 border-mischka-200 shadow-xl shadow-mischka-300 flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="Chirp Logo" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black text-mischka-900 mb-2 uppercase italic tracking-tighter">CHIRP</h2>
                <p className="text-mischka-600 font-medium">Log in to continue </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-rose-50 text-rose-500 text-sm font-bold p-4 rounded-2xl border border-rose-100 italic">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[13px] font-bold text-mischka-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-mischka-400 group-focus-within:text-mischka-900 transition-colors" />
                        <input
                            type="email"
                            required
                            className="w-full bg-mischka-50 border-2 border-transparent focus:border-mischka-300 focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold transition-all outline-none text-mischka-900"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[13px] font-bold text-mischka-500 uppercase tracking-widest">Password</label>
                        <button type="button" className="text-[12px] font-bold text-mischka-600 hover:underline"></button>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-mischka-400 group-focus-within:text-mischka-900 transition-colors" />
                        <input
                            type="password"
                            required
                            className="w-full bg-mischka-50 border-2 border-transparent focus:border-mischka-300 focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold transition-all outline-none text-mischka-900"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-mischka-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-mischka-700 transition-all shadow-xl shadow-mischka-200 group active:scale-95 disabled:opacity-50"
                >
                    {loading ? "Signing In..." : "Sign In"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-6 text-center">
                <p className="text-sm font-medium text-mischka-600">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/signup")}
                        className="text-mischka-800 font-bold hover:underline"
                    >
                        Create Account
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;