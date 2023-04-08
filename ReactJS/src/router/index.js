import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Home from "../pages/home";

// Scroll to Top when switching page
const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

// Private routing
const Auth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    swal({
      title: "Denied!",
      text: `Access Denied, Please Login!`,
      icon: "error",
    });
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          {/* Auth Routes  */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main Routes */}
          <Route
            path="/"
            element={
              <Auth>
                <Home />
              </Auth>
            }
          />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default Router;
