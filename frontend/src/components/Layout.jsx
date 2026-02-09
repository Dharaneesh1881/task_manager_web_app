import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Clock,
    CheckCircle2,
    Zap,
    ChevronDown,
    Activity
} from "lucide-react";

const Layout = ({ user, children }) => {
    const location = useLocation();

    const navigations = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Pending", path: "/pending", icon: Clock },
        { name: "In Process", path: "/in-process", icon: Activity },
        { name: "Completed", path: "/completed", icon: CheckCircle2 },
    ];

    return (
        <div className="flex min-h-screen bg-mischka-50 text-mischka-900 font-sans">
            {/* LEFT SIDEBAR */}
            <aside className="w-64 bg-mischka-100 border-r border-mischka-200 flex flex-col sticky top-0 h-screen shrink-0">
                <div className="p-6">
                    {/* USER PROFILE SHORTCUT */}
                    <div className="flex items-center gap-3 mb-10">
                        <div>
                            <h2 className="text-[15px] font-bold text-mischka-900 leading-tight">
                                Hey, {user?.name || "User"}
                            </h2>
                            <p className="text-[11px] text-mischka-600 font-medium flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5 fill-mischka-600" />
                                Let's crush some tasks!
                            </p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navigations.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
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
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER */}
                <header className="h-20 bg-mischka-100/80 backdrop-blur-md border-b border-mischka-200 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Chirp Logo" className="h-10 w-10 object-contain rounded-lg" />
                        <h1 className="text-2xl font-black text-mischka-900 tracking-tighter uppercase italic">CHIRP</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/settings" className="flex items-center gap-4 group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-[13px] font-bold text-mischka-900 group-hover:text-mischka-600 transition-colors">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-[11px] text-mischka-600">
                                        {user?.email || "user@example.com"}
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-mischka-600 flex items-center justify-center text-white font-bold shadow-lg shadow-mischka-100">
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-mischka-100 rounded-full"></div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-mischka-400 group-hover:text-mischka-600 transition-colors" />
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-auto">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
