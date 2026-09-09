import { Routes, Route } from "react-router";
import UserProfile from "./pages/UserProfile";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Tasks from "./pages/Tasks";

import AllCompanies from "./pages/AllCompanies";
import OneCompanyPage from "./pages/OneCompanyPage";
import OneProject from "./pages/OneProject";
import Planning from "./pages/Planning";
import NotifPage from "./pages/NotifPage";
import OneTask from "./pages/OneTask";
import PrivateRoute from "./utils/PrivateRoute";
import ShoppingLines from "./pages/ShoppingLines";
import Toast from "./modals/Toast";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import UnauthorizedPage from "./pages/Unauthorized.page";
import NotFoundPage from "./pages/NotFound.page";

function App() {
  return (
    <>
      <Toast />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:id" element={<OneProject />} />

            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/notif" element={<NotifPage />} />
            <Route path="/planning" element={<Planning />} />
          </Route>
        </Route>

        <Route
          element={<PrivateRoute allowedRoles={["SITE_MANAGER", "COMPANY"]} />}
        >
          <Route element={<PrivateLayout />}>
            <Route path="/shoppingLines/:id" element={<ShoppingLines />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<OneTask />} />
            <Route path="/all-companies" element={<AllCompanies />} />
            <Route path="/companies/:id" element={<OneCompanyPage />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
