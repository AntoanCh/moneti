import { BrowserRouter, Route, Routes } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/bg";
import Box from "@mui/material/Box";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Main from "./pages/Main.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import * as React from "react";

function App() {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
      {/* <AuthProvider> */}
      <BrowserRouter>
        <Box
          sx={{
            margin: "auto",
            width: "100%",
            marginTop: "4%",
          }}
        >
          <Routes>
            {/* <Route path="/login" element={<Login />} /> */}
            <Route
              path="/:store"
              element={
                <PrivateRoute
                  open={open}
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                >
                  <Home
                    open={open}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                  />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Main />} />
          </Routes>
        </Box>
      </BrowserRouter>
      {/* </AuthProvider> */}
    </LocalizationProvider>
  );
}

export default App;
