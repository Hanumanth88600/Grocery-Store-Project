import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage
from "./pages/LoginPage";

import DashboardPage
from "./pages/DashboardPage";

import ProductsPage
from "./pages/ProductsPage";

import OrdersPage
from "./pages/OrdersPage";

import DeliveryAgentsPage
from "./pages/DeliveryAgentsPage";

import AnalyticsPage
from "./pages/AnalyticsPage";

import CategoriesPage
from "./pages/CategoriesPage";

import SettingsPage
from "./pages/SettingsPage";


import PickerDashboard
from "./pages/PickerDashboard";

import DeliveryDashboard
from "./pages/DeliveryDashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={
            <LoginPage />
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <DashboardPage />
          }
        />

        {/* PRODUCTS */}

        <Route
          path="/products"
          element={
            <ProductsPage />
          }
        />

        {/* ORDERS */}

        <Route
          path="/orders"
          element={
            <OrdersPage />
          }
        />

        {/* DELIVERY */}

        <Route
          path="/delivery-agents"
          element={
            <DeliveryAgentsPage />
          }
        />

        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={
            <AnalyticsPage />
          }
        />

        {/* CATEGORIES */}

        <Route
          path="/categories"
          element={
            <CategoriesPage />
          }
        />

        {/* SETTINGS */}

        <Route
          path="/settings"
          element={
            <SettingsPage />
          }
        />

        <Route
  path="/picker-dashboard"
  element={
    <PickerDashboard />
  }
/>

<Route
  path="/delivery-dashboard"
  element={
    <DeliveryDashboard />
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;