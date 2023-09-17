import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Nurse from './components/Nurse.tsx';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/nurses/:nurseId',
    element: <Nurse />
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
)
