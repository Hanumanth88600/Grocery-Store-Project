import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage
from "./pages/LoginPage";

import PickerDashboard
from "./pages/PickerDashboard";

import PickerProfilePage
from "./pages/PickerProfilePage";

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
          path="/picker-dashboard"
          element={
            <PickerDashboard />
          }
        />

        <Route
          path="/picker-profile"
          element={
            <PickerProfilePage />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;