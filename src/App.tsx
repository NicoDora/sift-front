import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MainLayout이 모든 페이지의 부모가 됩니다 */}
        <Route path="/" element={<MainLayout />}>
          {/* 그 안에 HomePage가 자식으로 들어갑니다 (Outlet) */}
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;