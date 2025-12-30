import { useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../validation/authSchema";
import { FiLock, FiMail, FiActivity } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-[#0B0E14] text-white px-4">
      <div className="w-full max-w-sm">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 mb-4">
            <FiActivity size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Frontend Task</h2>
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-2">Authorization Required</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161B22] p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                className="w-full bg-[#0B0E14] border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600 transition-all font-medium placeholder:text-slate-600"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full bg-[#0B0E14] border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600 transition-all font-medium placeholder:text-slate-600"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg shadow-blue-600/20 mt-2">
              Access Dashboard
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm mt-6 font-medium">
            New operative? <Link to="/signup" className="text-blue-500 hover:underline">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;