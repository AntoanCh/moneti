import React, { useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useState } from "react";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, TextField, useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import Link from "@mui/material/Link";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const StoreList = ({ store }) => {
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [delDialog, setDelDialog] = useState(false);
  const [errorBanner, setErrorBanner] = useState({
    show: false,
    message: "",
    color: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [error, setError] = useState({ show: false, message: "" });
  const [records, setRecords] = useState({});
  const [rowCount, setRowCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      if (!records.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(`http://192.168.0.147:6969/api/stores/`);
        setRecords(res.data.data);

        //   setRowCount(res.data.count);
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
    }, 2 * 60 * 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [isLoading]);
  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Име",
        size: 160,
        muiTableBodyCellProps: {
          align: "center",
        },

        Cell: ({ cell }) => (
          <Typography variant="p" sx={{ fontWeight: 800 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorFn: (row) => row.name,
        id: "link",
        header: "Линк",
        size: 360,
        muiTableBodyCellProps: {
          align: "center",
        },
        // filterVariant: "select",
        Cell: ({ cell }) => (
          <Link
            href={`http://192.168.0.147:6969/${btoa(
              String.fromCharCode(...new TextEncoder().encode(cell.getValue()))
            )}`}
            underline="none"
          >
            {`http://192.168.0.147:6969/${btoa(
              String.fromCharCode(...new TextEncoder().encode(cell.getValue()))
            )}`}
          </Link>
        ),
      },
      {
        accessorKey: "_id",
        header: "ID",
        size: 360,
        muiTableBodyCellProps: {
          align: "center",
        },
        // filterVariant: "select",
        Cell: ({ cell }) => (
          <Typography variant="p" sx={{ fontWeight: 800 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Добавен",
        size: 360,
        muiTableBodyCellProps: {
          align: "center",
        },

        Cell: ({ cell }) => (
          <Typography variant="p" sx={{ fontWeight: 800 }}>
            {dayjs(cell.getValue()).format("DD.MM.YYYY - HH:mm:ss")}
          </Typography>
        ),
      },
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: records,
    rowCount,

    filterFns: {
      stringDateFn: (row, id, filterValue) => {
        return dayjs(row.original[id])
          .format("DD.MM.YYYY")
          .includes(dayjs(filterValue).format("DD.MM.YYYY"));
      },
      stringDateRangeFn: (row, columnId, value) => {
        const date = row.getValue(columnId);
        const [start, end] = value;
        //If one filter defined and date is null filter it
        if ((start || end) && !date) return false;
        if (start && !end) {
          return dayjs(date).isAfter(dayjs(start));
        } else if (!start && end) {
          return dayjs(date).isBefore(dayjs(end).add(1, "day"));
        } else if (start && end) {
          return (
            dayjs(date).isAfter(dayjs(start)) &&
            dayjs(date).isBefore(dayjs(end).add(1, "day"))
          );
        } else return true;
      },
    },
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFacetedValues: true,
    enableHiding: false,
    enableColumnResizing: true,
    enableRowPinning: false,
    // muiTableContainerProps: { sx: { maxHeight: "70vh" } },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        <IconButton
          onClick={() => {
            // axios.delete(
            //   `http://192.168.0.147:6969/api/stores/${row.original._id}`
            // );
            // setIsLoading(true);
            setDelDialog(row.original);
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      </Box>
    ),
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [50, 100, 200, 300],
      shape: "rounded",
      variant: "outlined",
    },
    enableColumnResizing: true,
    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: errorBanner.show,
    },
    initialState: {
      sorting: [
        {
          id: "name",
        },
      ],
      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: false,
      showColumnFilters: true,
      density: "compact",
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: lighten(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
      }),
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main,
    }),
  });

  return (
    <Box sx={{ margin: "5px", maxHeight: "100px", maxWidth: "95%" }}>
      <Dialog
        open={delDialog}
        onClose={() => setDelDialog(false)} // ✅ function, not direct call
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ cursor: "move", backgroundColor: "#42a5f5" }}
          id="draggable-dialog-title"
        >
          {`ИЗТРИВАНЕ НА ОБЕКТ ${delDialog.name}`}
          <IconButton
            sx={{ margin: 0, padding: 0, float: "right" }}
            color="error"
            onClick={() => setDelDialog(false)} // ✅ wrap in arrow function
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box sx={{ fontWeight: 800, marginTop: "20px" }}>
              СИГУРЕН ЛИ СТЕ, ЧЕ ИСКАТЕ ДА ИЗТРИЕТЕ ОБЕКТ {delDialog.name}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              axios.delete(
                `http://192.168.0.147:6969/api/stores/${delDialog._id}`
              );
              setDelDialog(false);
              setIsLoading(true);
            }} // ✅ same here
            autoFocus
          >
            ИЗТРИВАНЕ
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        <Typography>Добави нов обект</Typography>
        <TextField
          sx={{ margin: "5px" }}
          label="Име"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        ></TextField>

        <Button
          sx={{ margin: "10px" }}
          variant="contained"
          size="large"
          onClick={() => {
            if (newName) {
              axios
                .post("http://192.168.0.147:6969/api/stores", {
                  name: newName,
                  balance: 0,
                  balanceEUR: 0,
                })
                .then(() => {
                  setNewName("");
                  setIsLoading(true);
                })
                .catch((err) => console.error(err));
            } else {
              console.log("ENTER BOTH FIELDS");
            }
          }}
        >
          ДОБАВИ
        </Button>
      </Box>

      <MaterialReactTable table={table} />
    </Box>
  );
};

export default StoreList;
