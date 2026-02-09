import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const API_URL = "http://localhost:4000/api/tasks";

    const fetchTasks = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/gp`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error("Fetch tasks error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [token]);

    const createTask = async (taskData) => {
        try {
            const response = await fetch(`${API_URL}/gp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });
            const data = await response.json();
            if (data.success) {
                setTasks([data.task, ...tasks]);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: "Server error" };
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            const response = await fetch(`${API_URL}/gp/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });
            const data = await response.json();
            if (data.success) {
                setTasks(tasks.map((t) => (t._id === id ? data.task : t)));
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: "Server error" };
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/gp/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setTasks(tasks.filter((t) => t._id !== id));
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: "Server error" };
        }
    };

    return (
        <TaskContext.Provider
            value={{ tasks, loading, fetchTasks, createTask, updateTask, deleteTask }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);
