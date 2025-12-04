import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate, useLocation } from "react-router";
import axios from "axios";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import Paper from "@mui/material/Paper";
import AllBalances from "../components/AllBalances.jsx";
import StoreBalance from "../components/StoreBalance.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import ChangePass from "../components/ChangePass.jsx";
import PersonelList from "../components/PersonelList.jsx";
import StoreList from "../components/StoreList.jsx";

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

const Home = ({ open, handleOpen, handleClose }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [ip, setIp] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [personelList, setPersonelList] = useState(false);
  const [storeList, setStoreList] = useState(false);
  const token = localStorage.getItem("token");
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        // navigate("/login", { state: { from: location }, replace: true });
        handleOpen();
      }
      const { data } = await axios.post("http://192.168.0.147:6969/auth", {
        token,
      });
      const { status, user, id, ip } = data;
      setUsername(user);
      setUserId(id);
      setIp(ip);

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
        : (localStorage.removeItem("token"), handleOpen());
      //  navigate("/login")
    };

    verifyUser();
  }, [token, navigate]);

  const Logout = () => {
    localStorage.removeItem("token");
    // navigate("/login");
    handleOpen();
    window.location.reload();
  };

  const handleChangePass = () => {
    setChangePass(true);
  };

  const handlePersonelList = () => {
    setPersonelList(true);
    setStoreList(false);
  };
  const handleStoreList = () => {
    setPersonelList(false);
    setStoreList(true);
  };
  const handleRecordList = () => {
    setStoreList(false);
    setPersonelList(false);
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
        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: 24 }}>
          {username === "ADMIN"
            ? "АДМИНИСТРАТИВЕН"
            : `Обект: ${atob(params.store)}`}
        </Typography>

        <Typography
          variant="h1"
          sx={{ fontWeight: 800, fontSize: 24 }}
        >{`${username}`}</Typography>

        <Box>
          {username === "ADMIN" ? (
            <ButtonGroup sx={{ marginRight: "20px" }} variant="contained">
              <Button
                color="success"
                variant={!personelList && !storeList ? "contained" : "outlined"}
                onClick={handleRecordList}
              >
                СПИСЪК ДВИЖЕНИЯ
              </Button>
              <Button
                color="warning"
                variant={storeList ? "contained" : "outlined"}
                onClick={handleStoreList}
              >
                СПИСЪК ОБЕКТИ
              </Button>
              <Button
                color="secondary"
                variant={personelList ? "contained" : "outlined"}
                onClick={handlePersonelList}
              >
                СПИСЪК ПЕРСОНАЛ
              </Button>
            </ButtonGroup>
          ) : (
            ""
          )}

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
        {username !== "ADMIN" ? (
          <StoreBalance
            username={username}
            storeName={params.store}
            refresh={refresh}
            setRefresh={setRefresh}
            // verifyUser={verifyUser}
          />
        ) : personelList ? (
          <PersonelList />
        ) : storeList ? (
          <StoreList />
        ) : (
          <AllBalances />
        )}
      </Box>
    </Box>
  );
};

export default Home;
