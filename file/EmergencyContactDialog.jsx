// EmergencyContactDialog.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import "./emer.css";

const EmergencyContactDialog = ({ open, onClose, onSave, userId }) => {
  const [contact, setContact] = useState("");

  const handleSave = async () => {
    try {
      // Send the contact data to the backend
      await axios.post(
        `http://localhost:8080/api/updateEmergencyContacts/${userId}`,
        [contact],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onSave(contact);
      setContact(""); // Clear the input after saving
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error saving emergency contact:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm" // Sets the maximum width of the dialog
      fullWidth // Ensures the dialog takes up the full width
      sx={{
        "& .MuiDialog-paper": {
          padding: "20px", // Adds padding for aesthetics
          minWidth: "600px", // Set a minimum width for the dialog
          minHeight: "300px", // Set a minimum height for the dialog
        },
      }}
    >
      <DialogTitle>Add Emergency Contact</DialogTitle>
      <br></br>
      <DialogContent>
        <TextField
          label="Emergency Contact"
          fullWidth
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmergencyContactDialog;
