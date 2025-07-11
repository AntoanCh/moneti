import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import AllRecordstable from "./AllRecordTable";

const AllBalances = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [error, setError] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!stores) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(`http://192.168.0.147:6969/api/stores`);
        setStores(res.data.data);
      } catch (error) {
        setError({
          show: true,
          message: `Грешка при комуникация: ${error}`,
        });

        return;
      }

      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData(); // Fetch every 2 minutes
    }, 60 * 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);
  return (
    <Box>
      {stores.map((store) => (
        <TextField
          sx={{
            maxWidth: "50%",
            margin: "10px",

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
          label={store.name}
          value={store.balance.toLocaleString("bg-BG", {
            style: "currency",
            currency: "BGN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        />
      ))}
      <AllRecordstable />
    </Box>
  );
};

export default AllBalances;
