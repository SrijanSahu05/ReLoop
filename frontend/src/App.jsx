import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ViewProduct from "./pages/ViewProduct";
import UpdateProduct from "./pages/UpdateProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <> <Navbar /> <Home /> <Footer /> </>
    ),
  },
  {
    path: "/user/register",
    element: (
      <> <Navbar /> <Signup /> </>
    ),
  },
  {
    path: "/user/login",
    element: (
      <> <Navbar /> <Login /> </>
    ),
  },
  {
    path: "/user/verify-email",
    element: (
      <> <VerifyEmail /> </>
    ),
  },
  {
    path: "/user/forgot-password",
    element: (
      <> <ForgotPassword /> </>
    ),
  },
  {
    path: "/user/reset-password",
    element: (
      <> <ResetPassword /> </>
    ),
  },
  {
    path: "/user/profile/:userId",
    element: (
      <> <Navbar /> <Dashboard /> <Footer /> </>
    ),
  },
  {
    path: "/products",
    element: (
      <> <Navbar /> <Products /> <Footer /> </>
    ),
  },
  {
    path: "/product/:productId",
    element: (
      <> <Navbar /> <ViewProduct /> <Footer /> </>
    ),
  },
  {
    path: "/user/myitems/:productId",
    element: (
      <> <Navbar /> <ViewProduct /> <Footer /> </>
    ),
  },
  {
    path: "/user/myitems/update/:productId",
    element: (
      <><Navbar /> <UpdateProduct /> <Footer /></>
    ),
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;