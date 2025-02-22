import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/PortectedRoute";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
