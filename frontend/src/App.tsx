
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import SignUp from '@/pages/SignUp';
import SignIn from '@/pages/SignIn';
import Application from '@/pages/Application';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * Main App component with routing and Redux provider
 */
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Application />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
