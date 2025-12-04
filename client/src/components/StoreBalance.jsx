import React, { useEffect, useState } from "react";
import RecordTable from "../components/RecordTable.jsx";
import axios from "axios";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import CustomDialog from "../components/CustomDialog.jsx";

const StoreBalance = ({
  storeName,
  setRefresh,
  refresh,
  username,
  verifyUser,
}) => {
  const [store, setStore] = useState({ name: "", balance: 0 });
  const [open, setOpen] = useState({ show: false, type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [error, setError] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (store && !store.balance) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      if (storeName) {
        try {
          console.log(storeName);
          console.log(atob(storeName));
          const decoded = atob(storeName);
          const res = await axios.get(
            `http://192.168.0.147:6969/api/stores/name/${decoded}`
          );
          setStore(res.data[0]);
        } catch (error) {
          setError({
            show: true,
            message: `Грешка при комуникация: ${error}`,
          });

          return;
        }
      }

      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [username, refresh]);

  const handleOpen = (type) => {
    setOpen({ show: true, type: type });
  };
  return (
    <Box sx={{ margin: "10px" }}>
      <TextField
        sx={{
          maxWidth: "50%",
          marginTop: "20px",

          "& .MuiInputBase-input": {
            fontSize: 18,
            padding: 1,

            fontWeight: 800,
            textAlign: "center",
          },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000",
          },
          "& .MuiInputLabel-outlined": {
            color: "#000",
            fontWeight: "bold",
          },
        }}
        disabled
        id="fullWidth"
        label={"Баланс BGN"}
        value={
          store && store.balance
            ? store.balance.toLocaleString("bg-BG", {
                style: "currency",
                currency: "BGN",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : 0
        }
      />
      <TextField
        sx={{
          maxWidth: "50%",
          marginTop: "20px",
          marginLeft: "5px",

          "& .MuiInputBase-input": {
            fontSize: 18,
            padding: 1,

            fontWeight: 800,
            textAlign: "center",
          },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000",
          },
          "& .MuiInputLabel-outlined": {
            color: "#000",
            fontWeight: "bold",
          },
        }}
        disabled
        id="fullWidth"
        label={"Баланс €"}
        value={
          store && store.balanceEUR
            ? store.balanceEUR.toLocaleString("bg-BG", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : 0
        }
      />
      <Box>
        <Button
          sx={{ margin: "10px", fontWeight: 800 }}
          onClick={() => handleOpen("income")}
          color="success"
          variant="contained"
        >
          + ПРИХОД
        </Button>
        <Button
          sx={{ margin: "10px", fontWeight: 800 }}
          onClick={() => handleOpen("expense")}
          color="error"
          variant="contained"
        >
          - РАЗХОД
        </Button>
      </Box>
      {open && (
        <CustomDialog
          open={open}
          setOpen={setOpen}
          store={store}
          setRefresh={setRefresh}
          refresh={refresh}
          username={username}
        />
      )}
      <RecordTable store={store} />
    </Box>
  );
};

export default StoreBalance;
