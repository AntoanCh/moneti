import React, { useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useState } from "react";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const RecordTable = ({ store }) => {
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
        const res = await axios.get(`http://192.168.0.147:6969/api/records/`);
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
  }, []);

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";

  const columns = useMemo(
    () => [
      {
        accessorKey: "time",
        header: "Дата",
        size: 320,
        enableGlobalFilter: false,
        filterVariant: "date-range",
        filterFn: "stringDateRangeFn",
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return (
            <Typography variant="p" sx={{ fontWeight: 800 }}>
              {dayjs(cell.getValue()).format("DD.MM.YYYY - HH:mm:ss")}
            </Typography>
          );
        },
      },
      {
        accessorKey: "storeName",
        header: "Магазин",
        size: 120,
        filterVariant: "select",
        Cell: ({ cell }) => (
          <Typography variant="p" sx={{ fontWeight: 800 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "type",
        header: "Вид",
        size: 120,
        editable: false,
        enableGlobalFilter: false,
        filterVariant: "select",
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          if (cell.getValue() === "income") {
            return (
              <Chip
                size="small"
                sx={{
                  marginX: "2px",
                  fontWeight: 800,
                }}
                label="ПРИХОД"
                color="success"
              />
            );
          }
          if (cell.getValue() === "expense") {
            return (
              <Chip
                size="small"
                sx={{
                  marginX: "2px",
                  fontWeight: 800,
                }}
                label="РАЗХОД"
                color="error"
              />
            );
          }
        },
      },
      {
        accessorKey: "balance",
        header: "Баланс",
        size: 180,
        editable: false,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => (
          <Typography variant="p" sx={{ fontWeight: 800 }}>
            {parseInt(cell.getValue()).toLocaleString("bg-BG", {
              style: "currency",
              currency: "BGN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Typography>
        ),
      },

      {
        accessorKey: "value",
        header: "Сума",
        size: 150,
        editable: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell, row }) => (
          <Typography
            variant="p"
            color={row.original.type === "income" ? "success" : "error"}
            sx={{ fontWeight: 800 }}
          >
            {row.original.type === "income" ? "+ " : "- "}
            {cell.getValue()?.toLocaleString?.("bg-BG", {
              style: "currency",
              currency: "BGN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Typography>
        ),
      },
      {
        accessorFn: (row) =>
          row.type === "income"
            ? row.balance + row.value
            : row.balance - row.value,
        id: "balanceAfter",
        header: "Наличност",
        Cell: ({ cell }) => (
          <Typography variant="p" sx={{ fontWeight: 800 }}>
            {parseInt(cell.getValue()).toLocaleString("bg-BG", {
              style: "currency",
              currency: "BGN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
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
    enableRowPinning: true,
    muiTableContainerProps: { sx: { maxHeight: "70vh" } },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
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
          id: "time",
          desc: true,
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
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default RecordTable;
