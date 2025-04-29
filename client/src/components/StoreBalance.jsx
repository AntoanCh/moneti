import React, { useEffect, useState } from "react";
import RecordTable from "../components/RecordTable.jsx";
import axios from "axios";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import CustomDialog from "../components/CustomDialog.jsx";

const StoreBalance = ({ username }) => {
  const [store, setStore] = useState({ name: "", balance: 0 });
  const [open, setOpen] = useState({ show: false, type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [error, setError] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!store.balance) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      if (username && username.startsWith("H")) {
        try {
          const res = await axios.get(
            `http://192.168.0.147:6969/api/stores/name/${username}`
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
  }, [username]);

  const handleOpen = (type) => {
    setOpen({ show: true, type: type });
  };
  return (
    <Box>
      {open && <CustomDialog open={open} setOpen={setOpen} store={store} />}
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
            color: "#2e2e2e",
            fontWeight: "bold",
          },
        }}
        disabled
        id="fullWidth"
        label={"Баланс"}
        value={store.balance.toLocaleString("bg-BG", {
          style: "currency",
          currency: "BGN",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      />
      <Box
        sx={{
          // display: "flex",
          // justifyContent: "space-between",
          width: "80%",
          height: "100%",
          padding: 4,
          marginX: "auto",
        }}
      >
        <Button
          onClick={() => handleOpen("income")}
          color="success"
          variant="contained"
        >
          ПРИХОД
        </Button>
        <Button
          onClick={() => handleOpen("expense")}
          color="error"
          variant="contained"
        >
          РАЗХОД
        </Button>
      </Box>
      <RecordTable store={store} />
    </Box>
  );
};

export default StoreBalance;
