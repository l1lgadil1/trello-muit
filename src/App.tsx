import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import BoardsPage from './pages';
import BoardPage from './pages/board/[id]';
import { ThemeProvider } from './shared/theme/theme-context';
import { ThemeToggle } from './shared/ui/theme-toggle';

function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Protected Routes */}
            <Route
              path="/boards"
              element={
                <ProtectedRoute>
                  <BoardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/board/:id"
              element={
                <ProtectedRoute>
                  <BoardPage />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root to boards if authenticated, otherwise to login */}
            <Route
              path="/"
              element={<Navigate to="/boards" replace />}
            />
          </Routes>
        </Router>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
