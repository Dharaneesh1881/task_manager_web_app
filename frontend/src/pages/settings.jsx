import React, { useState } from "react";
import {
    ArrowLeft,
    User as UserIcon,
    ShieldCheck,
    Mail,
    Lock,
    LogOut,
    Save,
    KeyRound
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SettingsCard = ({ title, icon: Icon, children }) => (
    <div className="bg-mischka-100 p-8 rounded-[40px] border border-mischka-200 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-mischka-200 flex items-center justify-center">
                <Icon className="w-5 h-5 text-mischka-600" />
            </div>
            <h3 className="text-xl font-bold text-mischka-900">{title}</h3>
        </div>
        {children}
    </div>
);

const InputField = ({ label, icon: Icon, type = "text", value, placeholder, onChange, required = false }) => (
    <div className="mb-6">
        <label className="block text-[13px] font-bold text-mischka-600 uppercase tracking-wider mb-2 ml-1">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-colors group-hover:text-mischka-900 text-mischka-500">
                <Icon className="w-5 h-5" />
            </div>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                className="w-full bg-mischka-50 hover:bg-mischka-200/50 border-2 border-transparent focus:border-mischka-300 focus:bg-white rounded-2xl py-3.5 pl-14 pr-5 text-sm font-medium transition-all outline-none text-mischka-900"
            />
        </div>
    </div>
);

const Settings = () => {
    const { user, updateProfile, updatePassword, logout } = useAuth();
    const navigate = useNavigate();

    const [personalInfo, setPersonalInfo] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });

    const [passwordInfo, setPasswordInfo] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        const result = await updateProfile(personalInfo.name, personalInfo.email);
        if (result.success) {
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } else {
            setMessage({ type: "error", text: result.message });
        }
        setLoading(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }
        setLoading(true);
        setMessage({ type: "", text: "" });
        const result = await updatePassword(passwordInfo.oldPassword, passwordInfo.newPassword);
        if (result.success) {
            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswordInfo({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            setMessage({ type: "error", text: result.message });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-mischka-500 hover:text-mischka-900 font-bold mb-8 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-mischka-200 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                Back to Dashboard
            </button>

            <div className="flex items-center gap-6 mb-12">
                <div className="relative">
                    <div className="w-24 h-24 rounded-[32px] bg-mischka-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-mischka-200 ring-8 ring-mischka-50">
                        {personalInfo.name?.[0]?.toUpperCase() || "D"}
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-black text-mischka-900 mb-2">Account Settings</h2>
                    <p className="text-mischka-600 font-medium">Manage your profile and security settings</p>
                </div>
            </div>

            {message.text && (
                <div className={`mb-8 p-4 rounded-2xl border font-bold text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SettingsCard title="Personal Information" icon={UserIcon}>
                    <form onSubmit={handleProfileUpdate}>
                        <InputField
                            label="Full Name"
                            icon={UserIcon}
                            value={personalInfo.name}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                            required
                        />
                        <InputField
                            label="Email Address"
                            icon={Mail}
                            value={personalInfo.email}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-mischka-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-mischka-700 transition-all shadow-xl shadow-mischka-200 active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </SettingsCard>

                <SettingsCard title="Security" icon={ShieldCheck}>
                    <form onSubmit={handlePasswordUpdate}>
                        <InputField
                            label="Current Password"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={passwordInfo.oldPassword}
                            onChange={(e) => setPasswordInfo({ ...passwordInfo, oldPassword: e.target.value })}
                            required
                        />
                        <InputField
                            label="New Password"
                            icon={KeyRound}
                            type="password"
                            value={passwordInfo.newPassword}
                            onChange={(e) => setPasswordInfo({ ...passwordInfo, newPassword: e.target.value })}
                            required
                        />
                        <InputField
                            label="Confirm Password"
                            icon={KeyRound}
                            type="password"
                            value={passwordInfo.confirmPassword}
                            onChange={(e) => setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-mischka-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-mischka-700 transition-all shadow-xl shadow-mischka-200 active:scale-95 disabled:opacity-50"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            {loading ? "Updating..." : "Change Password"}
                        </button>
                    </form>
                </SettingsCard>

                <div className="md:col-span-2">
                    <SettingsCard title="Session" icon={LogOut}>
                        <div className="flex items-center justify-between p-6 rounded-3xl border border-mischka-200 bg-mischka-50">
                            <div>
                                <h4 className="text-[15px] font-bold text-mischka-900 mb-1">Sign Out</h4>
                                <p className="text-[13px] text-mischka-600 pr-8">Log out of your account and clear your session.</p>
                            </div>
                            <button
                                onClick={logout}
                                className="px-8 py-3 bg-mischka-600 text-white rounded-2xl font-bold hover:bg-mischka-700 transition-all shadow-lg shadow-mischka-200 active:scale-95 shrink-0 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
};

export default Settings;
