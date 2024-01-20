import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import "./HomePage.css";

function HomePage() {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/stats')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .then((data) => {
                setStats(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError(error.toString());
            });
    }, []);

    const handleDelete = (subject) => {
        fetch(`http://localhost:3000/api/delete/${subject}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setStats(prevStats => prevStats.filter(stat => stat.subject !== subject));
                } else {
                    console.error('Failed to delete record');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='table-container'>
            <h1>Home Page</h1>
            <TableContainer component={Paper}>
                <Table className='actualtable' aria-label="simple table">
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
                                <TableCell component="th" scope="row">{stat.subject}</TableCell>
                                <TableCell align="right">{!isNaN(parseFloat(stat.mean)) ? parseFloat(stat.mean).toFixed(2) : 'N/A'}</TableCell>
                                <TableCell align="right">{!isNaN(parseFloat(stat.median)) ? parseFloat(stat.median).toFixed(2) : 'N/A'}</TableCell>
                                <TableCell align="right">{!isNaN(parseFloat(stat.std)) ? parseFloat(stat.std).toFixed(2) : 'N/A'}</TableCell>
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

            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" gutterBottom>Descriptions</Typography>
                {stats.map((stat, index) => (
                    <Box key={index} sx={{ marginBottom: 2 }}>
                        <Typography variant="subtitle1">{stat.subject}</Typography>
                        <Typography variant="body2">{stat.desc || 'No description available.'}</Typography>
                    </Box>
                ))}
            </Box>
        </div>
    );
}

export default HomePage;
