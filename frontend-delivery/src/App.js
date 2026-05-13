import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage
from "./pages/LoginPage";

import DeliveryDashboard
from "./pages/DeliveryDashboard";

import DeliveryProfilePage
from "./pages/DeliveryProfilePage";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <LoginPage />
          }
        />

        <Route
          path="/delivery-dashboard"
          element={
            <DeliveryDashboard />
          }
        />

        <Route
          path="/delivery-profile"
          element={
            <DeliveryProfilePage />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;