function MainLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Banquito</h1>
          <p className="text-xs text-slate-500">Plataforma de ahorro</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-600 md:inline">
            {user?.name}
          </span>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

export default MainLayout;