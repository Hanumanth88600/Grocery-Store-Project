import React from "react";

import LoginPage
  from "./pages/LoginPage";

import AddressesPage
  from "./pages/AddressesPage";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage
  from "./pages/HomePage";

import TrackingPage
  from "./pages/TrackingPage";

import OrderHistoryPage
  from "./pages/OrderHistoryPage";


import ProfilePage
from "./pages/ProfilePage";  

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<HomePage />}
        />

        {/* TRACKING */}

        <Route
          path="/tracking"
          element={
            <TrackingPage />
          }
        />

        {/* ORDER HISTORY */}

        <Route
          path="/orders"
          element={
            <OrderHistoryPage />
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/addresses"
          element={
            <AddressesPage />
          }
        />

        <Route
  path="/profile"
  element={
    <ProfilePage />
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;