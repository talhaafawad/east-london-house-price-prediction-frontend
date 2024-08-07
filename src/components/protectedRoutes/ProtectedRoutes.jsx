import React from "react";
import { Route, Routes } from "react-router-dom";

import { links } from "../../constants/routes";
import { PrivateRoutes } from "../../utils/validatePermissions";

function AppRoutes() {
  return (
    <Routes>
      {links.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            {...route.others}
            element={<PrivateRoutes>{<route.component />}</PrivateRoutes>}
          />
        );
      })}
    </Routes>
  );
}

export default AppRoutes;
