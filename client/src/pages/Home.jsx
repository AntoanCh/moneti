import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import CustomDialog from "../components/CustomDialog.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");
  const [store, setStore] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [error, setError] = useState({ show: false, message: "" });
  const [open, setOpen] = useState({ show: false, type: "" });

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:6969/auth", {
        token,
      });
      const { status, user, role } = data;
      setUsername(user);

      return status
        ? // toast(`${user}`, {
          //     position: "top-right",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: "dark",
          //   })
          ""
        : (localStorage.removeItem("token"), navigate("/login"));
    };
    verifyUser();
  }, [token, navigate]);
  useEffect(() => {
    const fetchData = async () => {
      if (!store.balance) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      if (username) {
        try {
          const res = await axios.get(
            `http://192.168.0.147:6969/api/stores/name/${username}`
          );
          setStore(res.data[0]);
          console.log(res.data);
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
  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {open && <CustomDialog open={open} setOpen={setOpen} store={store} />}
      <Box sx={{ width: "80%", height: "100%" }}>
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
          <TextField disabled id="fullWidth" value={store.balance} />
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
      </Box>
    </Box>
  );
};

export default Home;
