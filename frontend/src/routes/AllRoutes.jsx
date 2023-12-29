import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import Signup from "../pages/signup";
import Login from "../pages/login";
import PrivateRoute, { PrivateRouteAdmin } from "./PrivateRoutes";
import Profile from "../pages/profile";

const AllRoutes = () => {
  return (
    <Box>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Box>
  );
};

export default AllRoutes;
