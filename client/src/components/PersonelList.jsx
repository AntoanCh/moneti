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
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const PersonelList = ({ store }) => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
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
        const res = await axios.get(`http://192.168.0.147:6969/api/users/`);
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
        accessorKey: "username",
        header: "Име",
        size: 360,
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
    renderRowActions: ({ row }) =>
      row.original.username === "ADMIN" ? (
        ""
      ) : (
        <Box>
          <IconButton
            onClick={() => {
              axios.delete(
                `http://192.168.0.147:6969/api/users/${row.original._id}`
              );
              setIsLoading(true);
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
          <IconButton
            onClick={() => {
              axios.delete(
                `http://192.168.0.147:6969/api/users/${row.original._id}`
              );
              setIsLoading(true);
            }}
          >
            <VisibilityIcon color="warning" />
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
          id: "username",
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
      <Box>
        <Typography>Добави нов служител</Typography>
        <TextField
          sx={{ margin: "5px" }}
          label="Име"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        ></TextField>
        <TextField
          sx={{ margin: "5px" }}
          label="Парола"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        ></TextField>
        <Button
          sx={{ margin: "10px" }}
          variant="contained"
          size="large"
          onClick={() => {
            if (newUsername && newPassword) {
              axios
                .post("/auth/register", {
                  username: newUsername,
                  password: newPassword,
                })
                .then(() => {
                  setNewPassword("");
                  setNewUsername("");
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

export default PersonelList;
