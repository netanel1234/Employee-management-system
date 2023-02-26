import "./App.css";
import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ShiftReportPage from "./Components/ShiftReportPage";
import NotFound from "./Components/NotFound";
import Logout from "./Components/Logout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/shift-report" element={<ShiftReportPage />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/not-found" element={<NotFound />}></Route>
        <Route path="*" element={<Navigate replace to="/not-found" />} />
      </Routes>
    </div>
  );
}

export default App;
