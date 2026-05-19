import { usePrivy } from "@privy-io/react-auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AssetPage from "./pages/AssetPage";

function App() {
  const { ready, authenticated } = usePrivy();

  if (!ready) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Public — no auth needed */}
        <Route path="/asset/:id" element={<AssetPage />} />

        {/* Auth protected */}
        <Route
          path="/*"
          element={authenticated ? <Dashboard /> : <LoginPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;