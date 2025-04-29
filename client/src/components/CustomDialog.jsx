import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { Button, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const CustomDialog = ({ open, setOpen, store }) => {
  const [value, setValue] = useState(0);

  const handleClose = () => {
    setOpen({ show: false, type: "" });
  };

  const handleChange = (e) => {
    setValue(parseInt(e.target.value));
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        "http://192.168.0.147:6969/api/records",
        {
          time: dayjs(),
          balance: store.balance,
          type: open.type,
          value: value,
          storeName: store.name,
          storeId: store._id,
          edited: false,
        }
      );
    } catch (error) {}
  };

  return (
    <Dialog
      // PaperComponent={DraggablePaper}
      open={open.show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"xl"}
    >
      <DialogTitle
        style={{ cursor: "move", backgroundColor: "#42a5f5" }}
        id="draggable-dialog-title"
      >
        {open.type === "income" ? "ПРИХОД" : "РАЗХОД"}
        <IconButton
          sx={{
            margin: 0,
            padding: 0,
            float: "right",
          }}
          color="error"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
        <TextField onChange={handleChange} value={value} />
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
        <Button onClick={handleSubmit} variant="contained" autoFocus>
          Запиши
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
