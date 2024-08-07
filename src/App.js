import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import "./app.css";
import AppRoutes from "./components/protectedRoutes/ProtectedRoutes";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
