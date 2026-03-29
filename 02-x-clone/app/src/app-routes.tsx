import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PublicProfilePage } from "./pages/PublicProfilePage";
import { TweetsPage } from "./pages/TweetsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tweets" element={<TweetsPage />} />
        <Route path="/profile/:username" element={<PublicProfilePage />} />
      </Route>
    </Routes>
  );
}
