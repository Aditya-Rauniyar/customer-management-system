
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            await signup(
                formData.name,
                formData.email,
                formData.password
            );

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create account"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-4 sm:p-6">

            <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden grid lg:grid-cols-2">

                {/* Left Branding Panel */}
                <div className="hidden lg:flex bg-[#17152f] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden">

                    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-indigo-400/20 cf-float" />

<div className="absolute -top-12 -right-12 w-56 h-56 rounded-full border border-indigo-400/20 cf-float-reverse" />

<div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl cf-glow" />

{/* Floating decorative particles */}
<div className="absolute top-[28%] right-[18%] w-3 h-3 rounded-full bg-indigo-400/70 blur-[1px] cf-float" />

<div className="absolute bottom-[28%] right-[30%] w-2 h-2 rounded-full bg-violet-300/70 cf-float-reverse" />

<div className="absolute top-[48%] right-[12%] w-1.5 h-1.5 rounded-full bg-white/60 cf-glow" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-indigo-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-900/40">
                                C
                            </div>

                            <div>
                                <h1 className="text-xl font-bold">
                                    ClientFlow
                                </h1>
                                <p className="text-xs text-indigo-300">
                                    Customer workspace
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 max-w-md">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 text-indigo-300 text-xs font-medium mb-6">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            GET STARTED WITH CLIENTFLOW
                        </div>

                        <h2 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                            Your customers.
                            <span className="text-indigo-400"> One </span>
                            organized workspace.
                        </h2>

                        <p className="text-slate-400 mt-6 leading-7">
                            Create your account and bring your customer
                            information together in one simple workspace.
                        </p>
                    </div>

                    <div className="relative z-10 border-t border-white/10 pt-6">
                        <p className="text-sm text-slate-500">
                            ClientFlow · Customer Management System
                        </p>
                    </div>
                </div>

                {/* Right Signup Form */}
                <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-14 xl:px-20 cf-fade-up">

                    {/* Mobile Brand */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                            C
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                ClientFlow
                            </h1>
                            <p className="text-xs text-slate-500">
                                Customer workspace
                            </p>
                        </div>
                    </div>

                    <div className="max-w-md w-full mx-auto">

                        <div className="mb-8">
                            <p className="text-sm font-semibold text-indigo-600 mb-3">
                                CREATE YOUR ACCOUNT
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Get started with ClientFlow
                            </h2>

                            <p className="text-slate-500 mt-3">
                                Create an account to start managing your customers.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    autoComplete="name"
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                                />

                                <p className="text-xs text-slate-400 mt-2">
                                    Use at least 6 characters.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.99] shadow-lg shadow-indigo-200/60 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </button>

                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-indigo-600 font-semibold hover:text-indigo-700"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>

                    </div>

                    <p className="text-center text-xs text-slate-400 mt-12">
                        © {new Date().getFullYear()} ClientFlow. All rights reserved.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Signup;
