import React, { useState } from "react";
import {
    Plus,
    LayoutGrid,
    Flame,
    Filter,
    Calendar,
    CheckCircle2,
    Clock,
    TrendingUp,
    Activity,
    Trash2,
    Edit2,
    X,
    Home,
    Droplets,
    Zap,
    Circle,
    AlertTriangle
} from "lucide-react";
import { useTasks } from "../context/TaskContext";

const StatCard = ({ icon: Icon, label, value, iconColor, bgColor }) => (
    <div className="bg-mischka-100 p-5 rounded-[24px] border border-mischka-200 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
            <h3 className="text-2xl font-black text-mischka-900 leading-none mb-1">{value}</h3>
            <p className="text-[12px] font-semibold text-mischka-600 uppercase tracking-tight">{label}</p>
        </div>
    </div>
);

const RightSidebarCard = ({ title, children, icon: Icon }) => (
    <div className="bg-mischka-100 p-6 rounded-[32px] border border-mischka-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
            {Icon && <Icon className="w-5 h-5 text-mischka-600" />}
            <h3 className="text-lg font-bold text-mischka-900">{title}</h3>
        </div>
        {children}
    </div>
);

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
    const [formData, setFormData] = useState(task || {
        title: "",
        description: "",
        priority: "low",
        status: "pending",
        dueDate: ""
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-mischka-900/40 backdrop-blur-sm p-4">
            <div className="bg-mischka-50 w-full max-w-lg rounded-[40px] shadow-2xl p-8 animate-in zoom-in duration-300 border border-mischka-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-mischka-900">{task ? "Edit Task" : "New Task"}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-mischka-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-mischka-600" />
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-mischka-600 uppercase tracking-widest ml-1">Task Title</label>
                        <input
                            autoFocus
                            required
                            className="w-full bg-mischka-100 border-2 border-transparent focus:border-mischka-300 focus:bg-white rounded-2xl py-4 px-6 text-sm font-semibold transition-all outline-none"
                            placeholder="What needs to be done?"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-mischka-600 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            className="w-full bg-mischka-100 border-2 border-transparent focus:border-mischka-300 focus:bg-white rounded-2xl py-4 px-6 text-sm font-semibold transition-all outline-none min-h-[100px]"
                            placeholder="Add some details..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-mischka-600 uppercase tracking-widest ml-1">Priority</label>
                            <select
                                className="w-full bg-mischka-100 border-2 border-transparent focus:border-mischka-300 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-mischka-600 uppercase tracking-widest ml-1">Status</label>
                            <select
                                className="w-full bg-mischka-100 border-2 border-transparent focus:border-mischka-300 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-mischka-600 text-white py-4 rounded-2xl font-bold hover:bg-mischka-700 transition-all shadow-xl shadow-mischka-200 active:scale-95"
                    >
                        {task ? "Update Task" : "Create Task"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Dashboard = ({ filter: pageFilter }) => {
    const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
    const [activeFilter, setActiveFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const filters = ["All", "Today", "Week", "High", "Medium", "Low"];

    const filteredTasks = tasks.filter(task => {
        if (pageFilter === "pending" && task.status !== "pending") return false;
        if (pageFilter === "in-process" && task.status !== "in-progress") return false;
        if (pageFilter === "completed" && task.status !== "completed") return false;

        if (activeFilter === "All") return true;
        if (activeFilter === "In Progress") return task.status === "in-progress";
        if (activeFilter === "High") return task.priority === "high";
        if (activeFilter === "Medium") return task.priority === "medium";
        if (activeFilter === "Low") return task.priority === "low";
        return true;
    });

    const stats = [
        { icon: Home, label: "Total Tasks", value: tasks.length, iconColor: "text-mischka-600", bgColor: "bg-mischka-200" },
        { icon: Droplets, label: "Low Priority", value: tasks.filter(t => t.priority === "low").length, iconColor: "text-emerald-500", bgColor: "bg-emerald-50" },
        { icon: AlertTriangle, label: "Medium", value: tasks.filter(t => t.priority === "medium").length, iconColor: "text-orange-500", bgColor: "bg-orange-50" },
        { icon: Flame, label: "High Priority", value: tasks.filter(t => t.priority === "high").length, iconColor: "text-rose-500", bgColor: "bg-rose-50" },
    ];

    const totalCompleted = tasks.filter(t => t.status === "completed").length;
    const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

    const handleCreateOrUpdate = async (data) => {
        if (editingTask) {
            await updateTask(editingTask._id, data);
        } else {
            await createTask(data);
        }
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleToggleStatus = (task) => {
        const newStatus = task.status === "completed" ? "pending" : "completed";
        updateTask(task._id, { ...task, status: newStatus });
    };

    return (
        <div className="flex gap-8">
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-mischka-900 mb-1 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-mischka-200 flex items-center justify-center">
                                <LayoutGrid className="w-5 h-5 text-mischka-600" />
                            </div>
                            {pageFilter ? (pageFilter === "in-process" ? "In Process Tasks" : pageFilter.charAt(0).toUpperCase() + pageFilter.slice(1) + " Tasks") : "Task Overview"}
                        </h2>
                        <p className="text-mischka-600 font-medium">Manage your tasks efficiently</p>
                    </div>
                    <button
                        onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                        className="bg-mischka-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-mischka-200 hover:bg-mischka-700 transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Task
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="bg-mischka-100 p-8 rounded-[40px] border border-mischka-200 shadow-sm min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-mischka-900 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-mischka-600" />
                            Tasks List
                        </h3>

                        <div className="flex bg-mischka-50 p-1.5 rounded-2xl border border-mischka-200/50">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-5 py-2 text-[13px] font-bold rounded-xl transition-all ${activeFilter === filter
                                        ? "bg-mischka-600 text-white shadow-sm ring-1 ring-mischka-200"
                                        : "text-mischka-500 hover:text-mischka-900"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-mischka-600 border-t-transparent"></div>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        <div className="space-y-4">
                            {filteredTasks.map((task) => (
                                <div key={task._id} className="group p-5 rounded-3xl border border-mischka-200 bg-mischka-200/40 hover:bg-mischka-200/60 transition-all flex items-center gap-6 shadow-sm hover:shadow-md">
                                    <button
                                        onClick={() => handleToggleStatus(task)}
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.status === "completed"
                                            ? "bg-mischka-600 border-mischka-600 text-white"
                                            : "border-mischka-200 text-transparent hover:border-mischka-400"
                                            }`}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-[15px] font-bold leading-tight mb-1 ${task.status === "completed" ? "text-mischka-400 line-through" : "text-mischka-900"}`}>
                                            {task.title}
                                        </h4>
                                        <p className="text-[13px] text-mischka-600 truncate">{task.description}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${task.priority === "high" ? "bg-rose-50 text-rose-500" :
                                            task.priority === "medium" ? "bg-orange-50 text-orange-500" :
                                                "bg-emerald-50 text-emerald-500"
                                            }`}>
                                            {task.priority}
                                        </span>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                                className="p-2 text-mischka-500 hover:text-mischka-900 hover:bg-white rounded-xl shadow-sm transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteTask(task._id)}
                                                className="p-2 text-mischka-500 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                            <div className="w-20 h-20 rounded-3xl bg-mischka-200 flex items-center justify-center mb-6">
                                <Calendar className="w-10 h-10 text-mischka-600" />
                            </div>
                            <h4 className="text-xl font-bold text-mischka-900 mb-2">No tasks found</h4>
                            <p className="text-mischka-600 mb-8 max-w-[280px]">Create your first task to get started on your journey</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-mischka-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-mischka-200 hover:bg-mischka-700 transition-all"
                            >
                                Add New Task
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-[380px] hidden xl:block">
                <RightSidebarCard title="Task Statistics" icon={TrendingUp}>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Total Tasks", value: tasks.length, icon: Circle, color: "text-mischka-600", border: "border-mischka-200" },
                            { label: "Completed", value: totalCompleted, icon: Circle, color: "text-emerald-500", border: "border-mischka-200/50" },
                            { label: "Pending", value: tasks.length - totalCompleted, icon: Circle, color: "text-mischka-400", border: "border-mischka-200/50" },
                            { label: "Completion Rate", value: `${completionRate}%`, icon: Zap, color: "text-mischka-600", border: "border-mischka-200/50" },
                        ].map((item) => (
                            <div key={item.label} className={`p-4 rounded-2xl border ${item.border} bg-mischka-50 transition-all hover:scale-105`}>
                                <div className="flex items-center justify-between mb-2">
                                    <item.icon className={`w-4 h-4 ${activeFilter === 'All' ? item.color : 'text-mischka-300'}`} />
                                    <span className="text-lg font-black text-mischka-900">{item.value}</span>
                                </div>
                                <p className="text-[10px] font-bold text-mischka-500 uppercase tracking-tighter">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-mischka-600"></div>
                                <span className="text-[13px] font-bold text-mischka-900">Task Progress</span>
                            </div>
                            <span className="text-[11px] font-black text-mischka-600 bg-mischka-200 px-2.5 py-1 rounded-full border border-mischka-300">
                                {totalCompleted} / {tasks.length}
                            </span>
                        </div>
                        <div className="h-3 w-full bg-mischka-100 rounded-full overflow-hidden border border-mischka-200 p-0.5">
                            <div style={{ width: `${completionRate}%` }} className="h-full bg-gradient-to-r from-mischka-500 via-mischka-600 to-mischka-700 rounded-full transition-all duration-1000"></div>
                        </div>
                    </div>
                </RightSidebarCard>

                <RightSidebarCard title="Recent Activity" icon={Activity}>
                    {tasks.length > 0 ? (
                        <div className="space-y-4">
                            {tasks.slice(0, 3).map(task => (
                                <div key={task._id} className="flex gap-4">
                                    <div className="w-2 h-10 bg-mischka-200 rounded-full"></div>
                                    <div>
                                        <p className="text-[13px] font-bold text-mischka-900">{task.title}</p>
                                        <p className="text-[11px] text-mischka-500">Created {new Date(task.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-mischka-200 flex items-center justify-center mb-5 ring-4 ring-white">
                                <Clock className="w-8 h-8 text-mischka-400" />
                            </div>
                            <h4 className="text-[15px] font-bold text-mischka-900 mb-1">No recent activity</h4>
                            <p className="text-[12px] text-mischka-600">Tasks will appear here</p>
                        </div>
                    )}
                </RightSidebarCard>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
                task={editingTask}
                onSave={handleCreateOrUpdate}
            />
        </div>
    );
};

export default Dashboard;
