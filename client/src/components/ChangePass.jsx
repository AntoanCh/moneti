import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";

const ChangePass = ({ username, changePass, setChangePass, userId }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [caps, setCaps] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [alert, setAlert] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClose = () => {
    setChangePass(false);
  };

  const handleChange = (e) => {
    setNewPass(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/auth/updatepswrd", {
        password: newPass,
        _id: userId,
      });
      const { status, message } = data;

      setChangePass(false);
      setNewPass("");
      setAlert(true);
    } catch (error) {
      console.log(error);
    }
    setChangePass(false);
    setNewPass("");
  };

  return (
    <Box>
      <Dialog
        open={changePass}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">СМЯНА НА ПАРОЛА</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <Box>
            <header>{username}</header>
            <span>ID: </span>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>{userId}</span>
              <span style={{ color: "red" }}> {caps ? "CAPSLOCK ON" : ""}</span>
            </Box>
          </Box>

          <Box>
            <FormControl sx={{ minWidth: "400px" }} fullWidth variant="filled">
              <InputLabel htmlFor="filled-adornment-password">
                Нова Парола
              </InputLabel>

              <FilledInput
                value={newPass}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.getModifierState("CapsLock")) {
                    setCaps(true);
                  } else {
                    setCaps(false);
                  }
                }}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleClose}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Обнови
          </Button>
        </DialogActions>
      </Dialog>{" "}
    </Box>
  );
};

export default ChangePass;
