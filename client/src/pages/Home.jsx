import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import Paper from "@mui/material/Paper";
import AllBalances from "../components/AllBalances.jsx";
import StoreBalance from "../components/StoreBalance.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import ChangePass from "../components/ChangePass.jsx";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  //   ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  //   color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:6969/auth", {
        token,
      });

      const { status, user, id } = data;
      setUsername(user);
      setUserId(id);

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

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangePass = () => {
    setChangePass(true);
  };
  return (
    <Box>
      <ChangePass
        username={username}
        userId={userId}
        changePass={changePass}
        setChangePass={setChangePass}
      />
      <Item
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box></Box>
        <Typography
          variant="h1"
          sx={{ fontWeight: 800, fontSize: 24 }}
        >{`Здравейте, ${username}`}</Typography>

        <Box>
          <Button
            color="primary"
            sx={{ marginRight: "20px" }}
            variant="contained"
            onClick={handleChangePass}
          >
            <LockResetIcon />
            СМЯНА ПАРОЛА
          </Button>
          <Button onClick={Logout} color="error" variant="contained">
            <LogoutIcon />
            ИЗХОД
          </Button>
        </Box>
      </Item>
      <Box
        // display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%", alignContent: "center" }}
      >
        {username.startsWith("H") ? (
          <StoreBalance
            username={username}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        ) : (
          <AllBalances />
        )}
      </Box>
    </Box>
  );
};

export default Home;
