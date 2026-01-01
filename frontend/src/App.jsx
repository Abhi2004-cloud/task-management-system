import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskDetails from './components/TaskDetails';
import Login from './components/Login';
import Register from './components/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="App">
                  <Header />
                  <main className="py-4">
                    <div className="container">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/tasks/:id" element={<TaskDetails />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
