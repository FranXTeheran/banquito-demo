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
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <p>Cargando dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  // 🔥 USERS DEMO (FIX)
  const filteredUsers = [
    { id: 1, name: "Admin Demo", role: "admin" },
    { id: 2, name: "Usuario Demo", role: "user" },
  ].filter((u) => u.role === "user");

  return (
    <MainLayout>
      <div className="p-6">
        <h2>Registrar aporte</h2>

        <form onSubmit={handleSubmit}>
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
          >
            <option value="">Selecciona un usuario</option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Monto"
          />

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>

          <button type="submit">Guardar aporte</button>
        </form>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;