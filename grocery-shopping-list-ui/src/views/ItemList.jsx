import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  useGridApiRef,
  DataGridPro,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import { randomId } from "@mui/x-data-grid-generator";
import axios from "axios";
import { PATH } from "../Config";

function EditToolbar(props) {
  const { apiRef } = props;

  const handleClick = () => {
    const id = randomId();
    apiRef.current.updateRows([{ id, isNew: true }]);
    apiRef.current.setRowMode(id, "edit");
    // wait for the grid to render with the new row
    setTimeout(() => {
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowsCount() - 1,
      });

      apiRef.current.setCellFocus(id, "itemName");
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Item To Shopping List
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
};

export default function ItemList() {
  const [items, setItems] = useState([]);

  const apiClient = axios.create();

  const getList = async () => {
    try {
      const response = await apiClient.get(PATH.concat("item"));
      setItems(response.data);
    } catch (err) {
      if (err && err.response) {
        const axiosError = err;
        alert("⚠️ Error!");
        console.log(axiosError.response?.data);
      }
      throw err;
    }
  };

  const addToList = async (param) => {
    try {
      await apiClient.post(PATH.concat("item/add"), param);
      getList();
    } catch (err) {
      if (err && err.response) {
        const axiosError = err;
        alert("⚠️ Error!");
        console.log(axiosError.response?.data);
      }
      throw err;
    }
  };

  const updateOnList = async (param) => {
    try {
      await apiClient.patch(PATH.concat("item/update"), param);
      getList();
    } catch (err) {
      if (err && err.response) {
        const axiosError = err;
        alert("⚠️ Error!");
        console.log(axiosError.response?.data);
      }
      throw err;
    }
  };

  const deleteOnList = async (id) => {
    try {
      await apiClient.patch(PATH.concat("item/delete"), {
        id,
      });
      getList();
    } catch (err) {
      if (err && err.response) {
        const axiosError = err;
        alert("⚠️ Error!");
        console.log(axiosError.response?.data);
      }
      throw err;
    }
  };

  React.useEffect(() => {
    getList();
  }, []);

  const apiRef = useGridApiRef();

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleCellFocusOut = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.setRowMode(id, "edit");
  };

  const handleSaveClick = (id) => async (event) => {
    event.stopPropagation();
    // Wait for the validation to run
    const isValid = await apiRef.current.commitRowChange(id);
    if (isValid) {
      apiRef.current.setRowMode(id, "view");
      const row = apiRef.current.getRow(id);
      if (row.isNew) {
        addToList(row);
      } else {
        updateOnList(row);
      }
      apiRef.current.updateRows([{ ...row, isNew: false }]);
    }
  };

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation();
    deleteOnList(id);
  };

  const handleCancelClick = (id) => (event) => {
    event.stopPropagation();
    apiRef.current.setRowMode(id, "view");

    const row = apiRef.current.getRow(id);
    if (row.isNew) {
      apiRef.current.updateRows([{ id, _action: "delete" }]);
    }
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = apiRef.current.getRowMode(id) === "edit";

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: "itemName", headerName: "Item Name", width: 250, editable: true },
  ];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <h3 style={{ textAlign: "center" }}>Shopping List</h3>
        <div style={{ height: 500, width: "100%" }}>
          <DataGridPro
            rows={items}
            columns={columns}
            apiRef={apiRef}
            editMode="row"
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            onCellFocusOut={handleCellFocusOut}
            components={{
              Toolbar: EditToolbar,
            }}
            componentsProps={{
              toolbar: { apiRef },
            }}
          />
        </div>
      </Box>
    </>
  );
}
