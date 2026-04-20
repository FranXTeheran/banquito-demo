import { useEffect, useState } from "react";
import api from "../../services/api";
import { createContributionRequest } from "../../services/contributionService";
import MainLayout from "../../components/layout/MainLayout";
import {
  Users,
  DollarSign,
  PlusCircle,
  FileText,
  CreditCard,
  ChevronDown,
} from "lucide-react";

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState({
    userId: "",
    amount: "",
    paymentMethod: "efectivo",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const dashboardResponse = await api.get("/dashboard/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDashboard(dashboardResponse.data.data);
      } catch (error) {
        console.log("Error cargando dashboard:", error);
      }
    };

    loadDashboard();
  }, []);

  const refreshDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(response.data.data);
    } catch (error) {
      console.log("Error refrescando dashboard:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await createContributionRequest(
        {
          userId: Number(form.userId),
          amount: Number(form.amount),
          paymentMethod: form.paymentMethod,
        },
        token
      );

      alert("Aporte registrado correctamente");
      setForm({
        userId: "",
        amount: "",
        paymentMethod: "efectivo",
      });

      await refreshDashboard();
    } catch (error) {
      console.log("Error al registrar aporte:", error);
      alert("Error al registrar aporte");
    }
  };

  if (!dashboard) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-80px)] overflow-x-hidden bg-gradient-to-br from-[#eef0ff] via-[#f5f0ff] to-[#eff5ff] px-4 py-6">
          <div className="mx-auto flex min-h-[300px] max-w-[1100px] items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/90 bg-white/75 p-12 text-center shadow-[0_4px_24px_rgba(99,102,241,0.08)] backdrop-blur-[20px]">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
              <p className="text-[15px] font-semibold text-indigo-500">
                Cargando dashboard...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const filteredUsers = [
    { id: 1, name: "Admin Demo", role: "admin" },
    { id: 2, name: "Usuario Demo", role: "user" },
  ].filter((u) => u.role === "user");

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-80px)] overflow-x-hidden bg-gradient-to-br from-[#eef0ff] via-[#f5f0ff] to-[#eff5ff] px-4 py-6">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-5">

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="relative min-w-0 overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-500 px-7 py-8 shadow-[0_20px_60px_rgba(67,56,202,0.4)] sm:px-9 xl:col-span-8">
              <div className="pointer-events-none absolute right-[60px] top-[-30px] h-[120px] w-[120px] rounded-full bg-white/10" />
              <div className="pointer-events-none absolute bottom-[-20px] right-[20px] h-[90px] w-[90px] rounded-[24px] bg-white/10" />
              <div className="pointer-events-none absolute right-[170px] top-[20px] h-[60px] w-[60px] rounded-full bg-white/10" />

              <p className="mb-1 text-[13px] font-medium uppercase tracking-[0.5px] text-white/70">
                Panel administrativo
              </p>

              <h1 className="mb-2 text-[22px] font-bold text-white sm:text-[26px]">
                Dashboard del Administrador
              </h1>

              <p className="max-w-[420px] text-[14px] leading-7 text-white/75">
                Resumen general del fondo y registro de aportes de los miembros.
              </p>
            </div>

            <div className="min-w-0 grid grid-cols-1 gap-4 xl:col-span-4">
              <div className="rounded-3xl border border-white/90 bg-white/75 p-6 shadow-[0_4px_24px_rgba(99,102,241,0.08)] backdrop-blur-[20px]">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <p className="max-w-[110px] text-[13px] font-medium text-gray-500">
                    Total ahorrado
                  </p>

                  <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-100 to-violet-200">
                    <DollarSign size={22} className="text-indigo-500" />
                  </div>
                </div>

                <div className="min-w-0 overflow-x-auto overflow-y-hidden">
                  <h2 className="min-w-max text-[30px] font-bold leading-none tracking-[-0.5px] text-gray-900">
                    ${Number(dashboard.totalAmount || 0).toLocaleString()}
                  </h2>
                </div>
              </div>

              <div className="rounded-3xl border border-white/90 bg-white/75 p-6 shadow-[0_4px_24px_rgba(99,102,241,0.08)] backdrop-blur-[20px]">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <p className="max-w-[110px] text-[13px] font-medium text-gray-500">
                    Total de aportes
                  </p>

                  <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-emerald-100 to-emerald-200">
                    <Users size={22} className="text-emerald-600" />
                  </div>
                </div>

                <div className="min-w-0 overflow-x-auto overflow-y-hidden">
                  <h2 className="min-w-max text-[30px] font-bold leading-none tracking-[-0.5px] text-gray-900">
                    {dashboard.totalContributions || 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/90 bg-white/75 p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)] backdrop-blur-[20px] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-100 to-violet-200">
                <PlusCircle size={20} className="text-indigo-500" />
              </div>

              <div className="min-w-0">
                <h2 className="m-0 text-[17px] font-bold text-[#1e1b4b]">
                  Registrar aporte
                </h2>
                <p className="m-0 text-[13px] text-gray-400">
                  Completa los campos para añadir un nuevo movimiento.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="min-w-0">
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.5px] text-gray-500">
                    Usuario
                  </label>

                  <div className="relative min-w-0">
                    <select
                      name="userId"
                      value={form.userId}
                      onChange={handleChange}
                      className="w-full min-w-0 appearance-none rounded-[14px] border border-indigo-200 bg-white/80 px-4 py-3 pr-11 text-[14px] text-[#1e1b4b] outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="">Selecciona un usuario</option>
                      {filteredUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.5px] text-gray-500">
                    Monto
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Ej: 50000"
                    className="w-full min-w-0 rounded-[14px] border border-indigo-200 bg-white/80 px-4 py-3 text-[14px] text-[#1e1b4b] outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.5px] text-gray-500">
                    Método de pago
                  </label>

                  <div className="relative min-w-0">
                    <select
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className="w-full min-w-0 appearance-none rounded-[14px] border border-indigo-200 bg-white/80 px-4 py-3 pr-11 text-[14px] text-[#1e1b4b] outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="block w-full rounded-[14px] bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_6px_20px_rgba(99,102,241,0.35)] transition hover:opacity-95 active:scale-[0.98]"
                >
                  Guardar aporte
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/90 bg-white/75 p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)] backdrop-blur-[20px] sm:p-7">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-[17px] font-bold text-[#1e1b4b]">
                  Últimos aportes
                </h2>
                <p className="text-[13px] text-gray-400">
                  Movimientos más recientes registrados en el sistema.
                </p>
              </div>

              <span className="w-fit rounded-full bg-indigo-500/10 px-3 py-1 text-[12px] font-semibold text-indigo-600">
                {dashboard.lastContributions?.length || 0} registros
              </span>
            </div>

            <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
              {!dashboard.lastContributions?.length ? (
                <div className="rounded-[18px] border-2 border-dashed border-indigo-200 bg-indigo-500/[0.03] p-10 text-center text-[14px] text-gray-400">
                  No hay aportes registrados todavía.
                </div>
              ) : (
                dashboard.lastContributions.map((contribution) => (
                  <div
                    key={contribution.id}
                    className="flex flex-col gap-3 rounded-[18px] border border-indigo-500/10 bg-gradient-to-br from-[#fafafe] to-[#f5f3ff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-500 to-violet-500">
                        <FileText size={16} className="text-white" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[#1e1b4b]">
                          {contribution.user?.name || "Usuario"}
                        </p>

                        <p className="flex items-center gap-1 text-[12px] text-gray-400">
                          <CreditCard size={11} />
                          <span className="truncate">
                            {contribution.paymentMethod}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="w-full rounded-[10px] bg-indigo-500/[0.06] px-3 py-2 sm:w-auto sm:bg-transparent sm:p-0 sm:text-right">
                      <p className="mb-0.5 text-[11px] text-gray-400">Monto</p>
                      <p className="whitespace-nowrap text-[16px] font-bold text-[#1e1b4b]">
                        ${Number(contribution.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;