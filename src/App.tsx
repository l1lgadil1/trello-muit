import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BoardsPage from './pages';
import BoardPage from './pages/board/[id]';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BoardsPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
      </Routes>
    </Router>
  );
}
