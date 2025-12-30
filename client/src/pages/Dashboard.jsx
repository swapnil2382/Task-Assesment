import { useEffect, useState } from "react";
import api from "../utils/api";
import { FiLogOut, FiPlus, FiTrash2, FiSearch, FiCheck, FiInbox, FiActivity } from "react-icons/fi";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks");
            setTasks(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchTasks(); }, []);

    const createTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            await api.post("/tasks", { title });
            setTitle("");
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const toggleTask = async (task) => {
        try {
            await api.put(`/tasks/${task._id}`, { completed: !task.completed });
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" ? true : filter === "completed" ? task.completed : !task.completed;
        return matchesSearch && matchesFilter;
    });

    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white font-sans antialiased selection:bg-blue-500/30">
            <div className="max-w-2xl mx-auto px-6 py-12">
                
                {/* 1. Header: High Contrast */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FiActivity className="text-blue-500 text-xl" />
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Frontend Developer Task</h1>
                        </div>
                        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
                            Status: <span className="text-blue-400">{completedCount}</span> / {totalCount} Completed
                        </p>
                    </div>
                    <button onClick={logout} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors border border-slate-800">
                        <FiLogOut size={20} />
                    </button>
                </header>

                {/* 2. Create Task: Dark Mode Style */}
                <form onSubmit={createTask} className="relative mb-8 group">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a new objective..."
                        className="w-full bg-[#161B22] border-2 border-slate-800 rounded-2xl py-5 px-6 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-lg font-medium placeholder:text-slate-600 shadow-2xl"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all active:scale-90 shadow-lg shadow-blue-600/20">
                        <FiPlus size={24} strokeWidth={3} />
                    </button>
                </form>

                {/* 3. Search & Filter: Precision Tools */}
                <div className="flex flex-col gap-4 mb-10">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Filter objectives..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#161B22] border border-slate-800 rounded-xl outline-none focus:border-slate-600 text-sm transition-all"
                        />
                    </div>
                    <div className="flex p-1 bg-[#161B22] rounded-xl border border-slate-800">
                        {['all', 'pending', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                    filter === f ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Task List: Minimalist & Clean */}
                <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-20 bg-[#161B22]/30 rounded-3xl border-2 border-dashed border-slate-800">
                            <FiInbox className="mx-auto text-slate-700 text-5xl mb-4" />
                            <p className="text-slate-600 font-bold tracking-widest text-xs uppercase">No Data Found</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div 
                                key={task._id} 
                                className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
                                    task.completed ? "bg-[#161B22]/50 border-transparent opacity-60" : "bg-[#161B22] border-slate-800 hover:border-blue-600/50 shadow-lg"
                                }`}
                            >
                                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleTask(task)}>
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                        task.completed ? "bg-blue-600 border-blue-600" : "border-slate-700 group-hover:border-blue-500"
                                    }`}>
                                        {task.completed && <FiCheck className="text-white stroke-[4px]" />}
                                    </div>
                                    <span className={`text-[17px] font-bold transition-all ${
                                        task.completed ? "line-through text-slate-600" : "text-slate-200"
                                    }`}>
                                        {task.title}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="p-2 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;