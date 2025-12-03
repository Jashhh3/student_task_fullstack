import React, { useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Plus, Calendar, CheckCircle,
    Clock, AlertCircle, Trash2, LogOut, Check
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import '../Dashboard.css';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                setAuthToken(null);
                navigate('/login');
            }
        }
    };

    const onLogout = () => {
        setAuthToken(null);
        navigate('/login');
    };

    const onChange = e => setNewTask({ ...newTask, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask);
            setNewTask({ title: '', description: '', due_date: '' });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTask = async (id) => {
        try {
            await api.patch(`/tasks/${id}/toggle`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    // Stats Calculation
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    const today = new Date().toISOString().split('T')[0];
    const dueToday = tasks.filter(t => t.due_date && t.due_date.startsWith(today) && t.status === 'pending').length;
    const overdue = tasks.filter(t => t.due_date && t.due_date < today && t.status === 'pending').length;

    // Chart Data (Mock data based on tasks for demo)
    const chartData = [
        { name: 'Mon', tasks: 4 },
        { name: 'Tue', tasks: 3 },
        { name: 'Wed', tasks: 6 },
        { name: 'Thu', tasks: 2 },
        { name: 'Fri', tasks: 5 },
        { name: 'Sat', tasks: 1 },
        { name: 'Sun', tasks: 2 },
    ];

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LayoutDashboard size={28} color="#4a5568" />
                    <h1>Student Dashboard</h1>
                </div>
                <button className="logout-btn" onClick={onLogout}>
                    <LogOut size={18} />
                    Logout
                </button>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Due Today</h3>
                        <p>{dueToday}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}>
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Upcoming</h3>
                        <p>{pendingTasks.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Completed</h3>
                        <p>{completedTasks.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Overdue</h3>
                        <p>{overdue}</p>
                    </div>
                </div>
            </div>

            <div className="main-content">
                {/* Left Column: Tasks */}
                <div className="tasks-section">
                    {/* Add Task Form */}
                    <div className="glass-panel">
                        <div className="section-title">
                            <Plus size={20} />
                            Add New Task
                        </div>
                        <form onSubmit={onSubmit} className="add-task-form">
                            <input
                                type="text"
                                placeholder="Task Title"
                                name="title"
                                value={newTask.title}
                                onChange={onChange}
                                className="glass-input"
                                required
                            />
                            <div className="form-row">
                                <input
                                    type="text"
                                    placeholder="Description (Optional)"
                                    name="description"
                                    value={newTask.description}
                                    onChange={onChange}
                                    className="glass-input"
                                />
                                <input
                                    type="datetime-local"
                                    name="due_date"
                                    value={newTask.due_date}
                                    onChange={onChange}
                                    className="glass-input"
                                />
                            </div>
                            <button type="submit" className="add-btn">
                                <Plus size={18} />
                                Create Task
                            </button>
                        </form>
                    </div>

                    {/* Task List */}
                    <div className="task-list">
                        {tasks.map(task => (
                            <div key={task.id} className="task-card">
                                <div className="task-content">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h3>{task.title}</h3>
                                        <span className={`status-badge status-${task.status}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <p>{task.description || 'No description'}</p>
                                    <div className="task-meta">
                                        {task.due_date && (
                                            <div className="meta-item">
                                                <Calendar size={14} />
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </div>
                                        )}
                                        <div className="meta-item">
                                            <Clock size={14} />
                                            {task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time'}
                                        </div>
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <button
                                        className="action-btn btn-check"
                                        onClick={() => toggleTask(task.id)}
                                        title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        className="action-btn btn-delete"
                                        onClick={() => deleteTask(task.id)}
                                        title="Delete Task"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                                No tasks found. Add one above!
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Analytics & History */}
                <div className="sidebar-section">
                    {/* Weekly Activity Chart */}
                    <div className="glass-panel">
                        <div className="section-title">
                            <LayoutDashboard size={20} />
                            Weekly Activity
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.2)' }}
                                        contentStyle={{ borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8ec5fc' : '#e0c3fc'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="glass-panel">
                        <div className="section-title">
                            <CheckCircle size={20} />
                            Recently Completed
                        </div>
                        <div className="history-list">
                            {completedTasks.slice(0, 5).map(task => (
                                <div key={task.id} className="history-item">
                                    <div className="history-icon">
                                        <Check size={16} />
                                    </div>
                                    <div className="history-info">
                                        <p>{task.title}</p>
                                        <span>{new Date(task.updated_at || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                            {completedTasks.length === 0 && (
                                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#718096' }}>
                                    No completed tasks yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
