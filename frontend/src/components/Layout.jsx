import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Clock,
    CheckCircle2,
    Zap,
    ChevronDown,
    Activity,
    Menu,
    X,
} from "lucide-react";

const Layout = ({ user, children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigations = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Pending", path: "/pending", icon: Clock },
        { name: "In Process", path: "/in-process", icon: Activity },
        { name: "Completed", path: "/completed", icon: CheckCircle2 },
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="flex min-h-screen bg-mischka-50 text-mischka-900 font-sans">
            {/* MOBILE SIDEBAR OVERLAY */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-mischka-900/40 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* SIDEBAR (DESKTOP & MOBILE DRAWER) */}
            <aside className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-mischka-100 border-r border-mischka-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen shrink-0
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6">
                    {/* SIDEBAR HEADER (Mobile Close Button) */}
                    <div className="flex items-center justify-between mb-10 lg:block">
                        {/* BRANDING (Only shown in sidebar on mobile for context) */}
                        <div className="flex items-center gap-3 lg:hidden">
                            <img src="/logo.png" alt="Chirp Logo" className="h-8 w-8 object-contain rounded-lg" />
                            <h1 className="text-xl font-black text-mischka-900 tracking-tighter uppercase italic">CHIRP</h1>
                        </div>
                        <button onClick={toggleMobileMenu} className="lg:hidden p-2 hover:bg-mischka-200 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-mischka-600" />
                        </button>
                    </div>

                    {/* USER PROFILE SHORTCUT (REFINED) */}
                    <div className="flex items-center gap-2 mb-10 bg-mischka-50/50 p-4 rounded-2xl border border-mischka-200/50">
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-black text-mischka-900 leading-tight truncate">
                                Hey, {user?.name || "User"}
                            </h2>
                            <p className="text-[11px] text-mischka-600 font-bold flex items-center gap-1.5 mt-1">
                                <Zap className="w-3 h-3 text-mischka-600" />
                                Rise and shine!
                            </p>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        {navigations.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? "bg-mischka-600 text-white shadow-lg shadow-mischka-200"
                                        : "text-mischka-500 hover:bg-mischka-200 hover:text-mischka-900"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-mischka-600"}`} />
                                    <span className="text-[14px] font-semibold">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* SETTINGS LINK AT BOTTOM OF SIDEBAR ON MOBILE */}
                <div className="mt-auto p-6 lg:hidden">
                    <Link
                        to="/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-mischka-500 hover:bg-mischka-200 hover:text-mischka-900 transition-all font-semibold"
                    >
                        <ChevronDown className="w-5 h-5 -rotate-90" />
                        Settings
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* HEADER */}
                <header className="h-16 lg:h-20 bg-mischka-100/80 backdrop-blur-md border-b border-mischka-200 sticky top-0 z-50 px-4 lg:px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        {/* MOBILE MENU TOGGLE */}
                        <button onClick={toggleMobileMenu} className="lg:hidden p-2 hover:bg-mischka-200 rounded-xl transition-colors">
                            <Menu className="w-6 h-6 text-mischka-600" />
                        </button>

                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Chirp Logo" className="h-8 w-8 lg:h-10 lg:w-10 object-contain rounded-lg" />
                            <h1 className="text-xl lg:text-2xl font-black text-mischka-900 tracking-tighter uppercase italic">CHIRP</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <Link to="/settings" className="flex items-center gap-2 lg:gap-4 group cursor-pointer transition-transform active:scale-95">
                            <div className="text-right hidden sm:block">
                                <p className="text-[12px] lg:text-[13px] font-bold text-mischka-900 group-hover:text-mischka-600 transition-colors">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-[10px] lg:text-[11px] text-mischka-600">
                                    {user?.email || "user@example.com"}
                                </p>
                            </div>
                            <div className="relative">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-mischka-600 flex items-center justify-center text-white text-xs lg:text-base font-bold shadow-lg shadow-mischka-100 ring-2 ring-mischka-100/50">
                                    {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 bg-green-500 border-2 border-mischka-100 rounded-full"></div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-mischka-400 group-hover:text-mischka-600 transition-colors hidden sm:block" />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto overflow-x-hidden">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
