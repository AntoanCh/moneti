import { BrowserRouter, Route, Routes } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/bg";
import Box from "@mui/material/Box";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
      <BrowserRouter>
        <Box
          sx={{
            margin: "auto",
            width: "100%",
            marginTop: "4%",
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/:store" element={<Home />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
