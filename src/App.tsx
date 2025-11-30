import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";
import HeatmapPage from "./pages/HeatmapPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MainLayout이 모든 페이지의 부모가 됩니다 */}
        <Route path="/" element={<MainLayout />}>
          {/* 1. 홈 화면 (기본 경로) */}
          <Route index element={<HomePage />} />

          {/* 2. 히트맵 화면 (추가된 부분) */}
          {/* path="heatmap"은 "/heatmap" 경로로 접속했을 때를 의미합니다 */}
          <Route path="heatmap" element={<HeatmapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
