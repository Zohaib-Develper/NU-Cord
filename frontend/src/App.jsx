import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import ServersPage from "./pages/ServersPage";
import DirectMessagesPage from "./pages/DirectMessagesPage";
import GroupsPage from "./pages/GroupsPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./utils/AdminRoute";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              // <AdminRoute>
              <AdminPage />
              // </AdminRoute>
            }
          />
          Protected Route for Homepage
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/servers"
            element={
              <PrivateRoute>
                <ServersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/directmessages"
            element={
              <PrivateRoute>
                <DirectMessagesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <PrivateRoute>
                <GroupsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
