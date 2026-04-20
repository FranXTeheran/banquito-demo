import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import MainLayout from "../../components/layout/MainLayout";
import { Wallet, FileText, TrendingUp, ArrowUpRight, Clock, CreditCard } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   SHARED DESIGN TOKENS — mismos en ambos dashboards
   ══════════════════════════════════════════════════════════ */
const T = {
  pageBg:       "linear-gradient(135deg,#eef0ff 0%,#f5f0ff 50%,#eff5ff 100%)",
  indigo:       "#6366f1",
  indigoDark:   "#4338ca",
  indigoShadow: "rgba(99,102,241,0.35)",
  white75:      "rgba(255,255,255,0.75)",
  white90:      "rgba(255,255,255,0.9)",
  textDark:     "#1e1b4b",
  textMuted:    "#6b7280",
  textFaint:    "#9ca3af",
  radius: {
    hero:    "28px",
    card:    "24px",
    item:    "18px",
    icon:    "15px",
    pill:    "20px",
    input:   "14px",
  },
  shadow: {
    card:  "0 4px 24px rgba(99,102,241,0.08)",
    hero:  "0 20px 60px rgba(99,102,241,0.35)",
    avatar:"0 4px 16px rgba(99,102,241,0.4)",
  },
};

/* ══════════════════════════════════════════════════════════
   GLOBAL CSS (media queries)
   ══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .db-page * { box-sizing: border-box; }
  .db-page   { font-family: 'DM Sans', sans-serif; }

  /* ── Layout grids ── */
  .db-top-row {
    display: grid;
    grid-template-columns: 1fr 260px;
    gap: 20px;
    align-items: stretch;
  }
  .db-metrics-row {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 16px;
  }
  .db-last-contrib-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 12px;
  }

  /* ── History item ── */
  .db-history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg,#fafafe,#f5f3ff);
    border-radius: 18px;
    padding: 14px 18px;
    border: 1px solid rgba(99,102,241,0.08);
    gap: 12px;
  }

  /* ── Hover states ── */
  .db-hero-btn:hover  { background: rgba(255,255,255,0.26) !important; }
  .db-history-item:hover { border-color: rgba(99,102,241,0.2); }

  /* ═══ TABLET ≤ 768px ═══ */
  @media (max-width: 768px) {
    .db-top-row              { grid-template-columns: 1fr; }
    .db-profile-card         {
      flex-direction: row !important;
      text-align: left !important;
      padding: 20px 24px !important;
      gap: 16px !important;
    }
    .db-profile-text         { text-align: left !important; }
    .db-metrics-row          { grid-template-columns: repeat(2,1fr); }
    .db-last-contrib-grid    { grid-template-columns: repeat(2,1fr); }
  }

  /* ═══ MOBILE ≤ 480px ═══ */
  @media (max-width: 480px) {
    .db-inner                { padding: 14px 12px !important; gap: 14px !important; }
    .db-hero-banner          { padding: 22px 20px !important; border-radius: 20px !important; }
    .db-hero-name            { font-size: 21px !important; }
    .db-hero-desc            { font-size: 13px !important; max-width: 100% !important; }
    .db-metrics-row          { grid-template-columns: 1fr; }
    .db-metric-value         { font-size: 26px !important; }
    .db-last-contrib-grid    { grid-template-columns: 1fr; }
    .db-section-card         { padding: 18px 16px !important; }
    .db-history-item         {
      flex-direction: column;
      align-items: flex-start;
    }
    .db-history-amount-box   {
      width: 100%;
      text-align: left !important;
      background: rgba(99,102,241,0.06);
      border-radius: 10px;
      padding: 8px 12px;
    }
    .db-history-list         { padding-right: 0 !important; }
  }
`;

function InjectStyles() {
  useEffect(() => {
    const id = "db-styles-v2";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.getElementById(id)?.remove();
  }, []);
  return null;
}

/* ══════════════════════════════════════════════════════════
   SHARED INLINE STYLE BUILDERS
   ══════════════════════════════════════════════════════════ */
const glassCard = (extra = {}) => ({
  background: T.white75,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: T.radius.card,
  padding: "24px",
  border: `1px solid ${T.white90}`,
  boxShadow: T.shadow.card,
  ...extra,
});

const metricIconBox = (bg) => ({
  width: "46px", height: "46px",
  borderRadius: T.radius.icon,
  background: bg,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
});

/* ══════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════ */
function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    (async () => {
      try {
        const res = await api.get("/dashboard/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboard(res.data.data);
      } catch (e) { console.log("Error cargando dashboard user:", e); }
    })();
  }, []);

  const totalSaved         = Number(dashboard?.totalSaved || 0);
  const contributions = useMemo(() => {
  return dashboard?.contributions || [];
  }, [dashboard]);
  const latestContribution = useMemo(() => contributions[0] ?? null, [contributions]);
  const averageContribution = useMemo(() => {
    if (!contributions.length) return 0;
    return contributions.reduce((acc, i) => acc + Number(i.amount || 0), 0) / contributions.length;
  }, [contributions]);

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  /* ── Loading ── */
  if (!dashboard) {
    return (
      <MainLayout>
        <InjectStyles />
        <div style={{ minHeight: "calc(100vh-80px)", background: T.pageBg, padding: "24px 16px" }} className="db-page">
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
            <div style={glassCard({ padding: "48px", textAlign: "center" })}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg,${T.indigo},#8b5cf6)`, margin: "0 auto 16px" }} />
              <p style={{ color: T.indigo, fontSize: "15px", fontWeight: "600", margin: 0 }}>Cargando dashboard...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <InjectStyles />
      <div style={{ minHeight: "calc(100vh - 80px)", background: T.pageBg, padding: "24px 16px" }} className="db-page">
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }} className="db-inner">

          {/* ══ TOP ROW: hero + perfil ══ */}
          <div className="db-top-row">

            {/* Hero */}
            <div
              className="db-hero-banner"
              style={{
                background: `linear-gradient(135deg,${T.indigo} 0%,#4f46e5 60%,${T.indigoDark} 100%)`,
                borderRadius: T.radius.hero, padding: "32px 36px",
                position: "relative", overflow: "hidden",
                boxShadow: T.shadow.hero,
              }}
            >
              {/* Decoraciones — confinadas a overflow:hidden, sin valores negativos en right que colisionen con el texto */}
              <div style={{ position:"absolute", top:"-40px", right:"40px",  width:"130px", height:"130px", borderRadius:"50%",  background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:"-30px", right:"30px", width:"100px", height:"100px", borderRadius:"22px", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />

              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"12px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase", margin:"0 0 8px" }}>
                Panel de ahorro
              </p>
              <h1 className="db-hero-name" style={{ color:"#fff", fontSize:"26px", fontWeight:"700", margin:"0 0 10px", position:"relative", zIndex:1 }}>
                Hola, {user?.name || "Usuario"}!
              </h1>
              <p className="db-hero-desc" style={{ color:"rgba(255,255,255,0.78)", fontSize:"14px", lineHeight:"1.75", maxWidth:"360px", margin:"0 0 24px", position:"relative", zIndex:1 }}>
                Aquí puedes revisar tu ahorro acumulado, consultar tus últimos
                aportes y mantener el control de tu progreso dentro del fondo.
              </p>
              <button
                className="db-hero-btn"
                style={{
                  display:"inline-flex", alignItems:"center", gap:"6px",
                  background:"rgba(255,255,255,0.15)", backdropFilter:"blur(10px)",
                  border:"1px solid rgba(255,255,255,0.28)", borderRadius:"13px",
                  padding:"10px 20px", color:"#fff", fontSize:"13px", fontWeight:"600",
                  cursor:"pointer", transition:"background 0.2s", position:"relative", zIndex:1,
                }}
              >
                Ver historial <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Perfil */}
            <div
              className="db-profile-card"
              style={{
                background: T.white75, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
                borderRadius: T.radius.hero, border:`1px solid ${T.white90}`,
                boxShadow: T.shadow.card,
                display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                gap:"10px", padding:"24px", textAlign:"center",
              }}
            >
              <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:`linear-gradient(135deg,${T.indigo},#8b5cf6)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: T.shadow.avatar, flexShrink:0 }}>
                <span style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>{getInitials(user?.name)}</span>
              </div>
              <div className="db-profile-text">
                <p style={{ color: T.textDark, fontSize:"16px", fontWeight:"700", margin:"0 0 6px" }}>{user?.name || "Usuario"}</p>
                <span style={{ color:"#7c3aed", fontSize:"12px", fontWeight:"600", background:"rgba(124,58,237,0.1)", padding:"3px 12px", borderRadius: T.radius.pill }}>
                  Miembro del fondo
                </span>
              </div>
            </div>
          </div>

          {/* ══ MÉTRICAS ══ */}
          <div className="db-metrics-row">
            {[
              { label:"Total ahorrado",      value:`$${totalSaved.toLocaleString()}`,                       bg:"linear-gradient(135deg,#ede9fe,#ddd6fe)", icon:<Wallet    size={21} color={T.indigo}   /> },
              { label:"Aportes registrados", value:contributions.length,                                     bg:"linear-gradient(135deg,#d1fae5,#a7f3d0)", icon:<FileText  size={21} color="#059669" /> },
              { label:"Promedio por aporte", value:`$${Math.round(averageContribution).toLocaleString()}`,  bg:"linear-gradient(135deg,#fef3c7,#fde68a)", icon:<TrendingUp size={21} color="#d97706" /> },
            ].map(({ label, value, bg, icon }) => (
              <div key={label} style={glassCard()}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ color: T.textMuted, fontSize:"13px", fontWeight:"500", margin:0 }}>{label}</p>
                    <h2 className="db-metric-value" style={{ color:"#111827", fontSize:"28px", fontWeight:"700", margin:"8px 0 0", letterSpacing:"-0.5px" }}>
                      {value}
                    </h2>
                  </div>
                  <div style={metricIconBox(bg)}>{icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ══ ÚLTIMO APORTE ══ */}
          <div style={glassCard({ padding:"28px" })} className="db-section-card">
            <h2 style={{ color: T.textDark, fontSize:"16px", fontWeight:"700", margin:"0 0 18px" }}>Último aporte</h2>
            {latestContribution ? (
              <div className="db-last-contrib-grid">
                {[
                  { icon:<Wallet     size={13} color="#7c3aed" />, label:"Monto",  value:`$${Number(latestContribution.amount||0).toLocaleString()}` },
                  { icon:<CreditCard size={13} color="#7c3aed" />, label:"Método", value: latestContribution.paymentMethod },
                  { icon:<Clock      size={13} color="#7c3aed" />, label:"Fecha",  value: new Date(latestContribution.createdAt).toLocaleDateString() },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", borderRadius: T.radius.item, padding:"18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"8px" }}>
                      {icon}
                      <p style={{ color:"#7c3aed", fontSize:"11px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.6px", margin:0 }}>{label}</p>
                    </div>
                    <p style={{ color: T.textDark, fontSize:"17px", fontWeight:"700", margin:0 }}>{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: T.textFaint, fontSize:"14px", margin:0 }}>Aún no tienes aportes registrados.</p>
            )}
          </div>

          {/* ══ HISTORIAL ══ */}
          <div style={glassCard({ padding:"28px" })} className="db-section-card">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"18px" }}>
              <h2 style={{ color: T.textDark, fontSize:"16px", fontWeight:"700", margin:0 }}>Historial de aportes</h2>
              <span style={{ background:"rgba(99,102,241,0.1)", color:"#4f46e5", fontSize:"12px", fontWeight:"600", padding:"4px 12px", borderRadius: T.radius.pill }}>
                {contributions.length} registros
              </span>
            </div>

            <div style={{ maxHeight:"420px", overflowY:"auto", display:"flex", flexDirection:"column", gap:"8px", paddingRight:"2px" }} className="db-history-list">
              {contributions.length === 0 ? (
                <div style={{ borderRadius: T.radius.item, border:"2px dashed rgba(99,102,241,0.2)", background:"rgba(99,102,241,0.03)", padding:"40px", textAlign:"center", color: T.textFaint, fontSize:"14px" }}>
                  No hay movimientos para mostrar.
                </div>
              ) : (
                contributions.map((c) => (
                  <div key={c.id} className="db-history-item">
                    <div style={{ display:"flex", alignItems:"center", gap:"12px", minWidth:0 }}>
                      <div style={{ width:"40px", height:"40px", borderRadius:"13px", background:`linear-gradient(135deg,${T.indigo},#8b5cf6)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <FileText size={16} color="#fff" />
                      </div>
                      <div style={{ minWidth:0 }}>
                        <p style={{ color: T.textDark, fontSize:"14px", fontWeight:"600", margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          Aporte registrado
                        </p>
                        <p style={{ color: T.textFaint, fontSize:"12px", margin:0 }}>
                          {c.paymentMethod} · {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }} className="db-history-amount-box">
                      <p style={{ color: T.textFaint, fontSize:"11px", margin:"0 0 2px" }}>Monto</p>
                      <p style={{ color: T.textDark, fontSize:"16px", fontWeight:"700", margin:0 }}>
                        ${Number(c.amount || 0).toLocaleString()}
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