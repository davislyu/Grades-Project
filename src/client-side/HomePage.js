import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./HomePage.css";

function HomePage() {
  const [stats, setStats] = useState([]);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3005/api/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => setError("Error fetching stats: " + error.message));

    fetch("http://localhost:3005/api/entries")
      .then((response) => response.json())
      .then((data) => setEntries(data))
      .catch((error) => setError("Error fetching entries: " + error.message));
  }, []);

  const handleDelete = (subject) => {
    fetch(`http://localhost:3005/api/delete/${subject}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete record");
        }
        setStats((prevStats) =>
          prevStats.filter((stat) => stat.subject !== subject)
        );
        setEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.subject !== subject)
        );
      })
      .catch((error) => setError("Error: " + error.message));
  };
  const handleDeleteEntry = (id) => {
    fetch(`http://localhost:3005/api/delete-entry/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete entry");
        }
        setEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== id)
        );
        fetchStats();
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error: " + error.message);
      });
  };

  const fetchStats = () => {
    fetch("http://localhost:3005/api/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => setError("Error fetching stats: " + error.message));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-container">
      <h1>Grades Interface</h1>

      <TableContainer component={Paper}>
        <Table className="actualtable" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell align="right">Mean</TableCell>
              <TableCell align="right">Median</TableCell>
              <TableCell align="right">Standard Deviation</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((stat, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {stat.subject}
                </TableCell>
                <TableCell align="right">
                  {!isNaN(parseFloat(stat.mean))
                    ? parseFloat(stat.mean).toFixed(2)
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  {!isNaN(parseFloat(stat.median))
                    ? parseFloat(stat.median).toFixed(2)
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  {!isNaN(parseFloat(stat.std))
                    ? parseFloat(stat.std).toFixed(2)
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(stat.subject)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Grade History</h2>
      <TableContainer component={Paper}>
        <Table className="actualtable entry-history" aria-label="entries table">
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell align="right">Grade</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Date Added</TableCell>
              <TableCell align="right">Delete</TableCell>{" "}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.subject}</TableCell>
                <TableCell align="right">{entry.grade}</TableCell>
                <TableCell align="right">{entry.desc}</TableCell>
                <TableCell align="right">{entry.date_added}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDeleteEntry(entry.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default HomePage;
