import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { loginRequest } from "../../services/authService";

function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginRequest(form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/user/dashboard";
      }
    } catch (error) {
      console.log(error);
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#eef0ff] via-[#f5f0ff] to-[#eff5ff] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1100px] items-center justify-center">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Panel izquierdo */}
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-500 px-8 py-10 shadow-[0_20px_60px_rgba(67,56,202,0.35)] sm:px-10">
            <div className="pointer-events-none absolute right-[50px] top-[-30px] h-[120px] w-[120px] rounded-full bg-white/10" />
            <div className="pointer-events-none absolute bottom-[-20px] right-[20px] h-[90px] w-[90px] rounded-[24px] bg-white/10" />
            <div className="pointer-events-none absolute right-[170px] top-[20px] h-[60px] w-[60px] rounded-full bg-white/10" />

            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[1px] text-white/70">
              Bienvenido
            </p>

            <h1 className="mb-4 text-[28px] font-bold text-white sm:text-[34px]">
              Inicia sesión en Banquito
            </h1>

            <p className="max-w-[420px] text-[14px] leading-7 text-white/80">
              Accede a tu cuenta para revisar tu ahorro, registrar aportes y
              gestionar tu información dentro de la plataforma.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                <ArrowRight size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Acceso seguro
                </p>
                <p className="text-xs text-white/70">
                  Tu sesión se procesa de forma protegida.
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="rounded-[28px] border border-white/90 bg-white/75 p-6 shadow-[0_4px_24px_rgba(99,102,241,0.08)] backdrop-blur-[20px] sm:p-8">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#1e1b4b]">
                Iniciar sesión
              </h2>
              <p className="mt-1 text-[14px] text-gray-400">
                Ingresa tus credenciales para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="min-w-0">
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.5px] text-gray-500">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"
                  />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full rounded-[14px] border border-indigo-200 bg-white/80 py-3 pl-11 pr-4 text-[14px] text-[#1e1b4b] outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.5px] text-gray-500">
                  Contraseña
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"
                  />
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-[14px] border border-indigo-200 bg-white/80 py-3 pl-11 pr-4 text-[14px] text-[#1e1b4b] outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 block w-full rounded-[14px] bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_6px_20px_rgba(99,102,241,0.35)] transition hover:opacity-95 active:scale-[0.98]"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;