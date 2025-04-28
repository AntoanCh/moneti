import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";

const BigButton = styled(Button)({
  fontWeight: 800,
  fontSize: 24,
  padding: 12,
  borderRadius: 4,
  border: "grey solid 4px",
  minHeight: "100%",
  minHeight: "150px",
  "&:Hover": {
    boxShadow: "5px 3px 3px 3px white",
  },
});

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [error, setError] = useState({ show: false, message: "" });

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
      if (!balance) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      if (username) {
        try {
          const res = await axios.get(
            `http://192.168.0.147:6969/api/stores/name/${username}`
          );
          setBalance(res.data.data);
          console.log(res);
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
      <Box sx={{ width: "80%", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
            height: "100%",
            padding: 4,
            marginX: "auto",
          }}
        >
          <TextField disabled label="fullWidth" id="fullWidth" />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
