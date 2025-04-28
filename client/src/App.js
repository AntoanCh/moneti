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
            <Route path="/" element={<Home />} />
            {/* <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/sites" element={<SitesList />} />
            <Route path="/hr" element={<Hr />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/records" element={<Records />} />
            <Route path="/drop-off/:id" element={<DropOff />} />
            <Route path="/drivers" element={<DriversList />} />
            <Route path="/hr/create" element={<CreatePerson />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/vehicles"
              element={
                <VehiclesMain
                  customFilter={customFilter}
                  setCustomFilter={setCustomFilter}
                  filter={filter}
                  setFilter={setFilter}
                  showExpense={showExpense}
                  setShowExpense={setShowExpense}
                  expenseWithTax={expenseWithTax}
                  setExpenseWithTax={setExpenseWithTax}
                />
              }
            />
            <Route path="/vehicles/details/:id" element={<ShowVehicle />} />
            <Route path="/people/details/:id" element={<PersonCard />} /> */}
          </Routes>
        </Box>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
