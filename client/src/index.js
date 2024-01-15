import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Roadmap from './components/Roadmap';
import GuardedRoute from './components/GuardedRoute';
import AdminPage from './components/Adminpage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/roadmap',
    element: <Roadmap />,
  },
  {
    path: '/guardedroute',
    element: (
      <GuardedRoute element={<AdminPage />}>
        <AdminPage />
      </GuardedRoute>
    ),
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
]);

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
