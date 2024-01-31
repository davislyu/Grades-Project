//InputPage.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import "./InputPage.css";

function InputPage() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const handleAddData = () => {
    const trimmedSubject = subject.trimEnd();

    if (!trimmedSubject || !grade) {
      setError("Please fill in both Subject and Grade fields.");
      return;
    }

    setError("");

    fetch("http://localhost:3005/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject: trimmedSubject, grade, desc }),
    }).then((response) => {
      if (response.ok) {
        console.log("Data added successfully.");
        setSubject("");
        setGrade("");
        setDesc("");
      } else {
        console.error("Failed to add data.");
        setError("Failed to add data.");
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography color={"white"} component="h1" variant="h5">
          Input Page
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            type="number"
            required
            fullWidth
            label="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            multiline
            rows={4}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            onClick={handleAddData}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Data
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default InputPage;
