import React, { useState, useEffect } from 'react';

function HomePage() {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/stats')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json(); // Parse JSON response
            })
            .then((data) => {
                console.log(data);
                setStats(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError(error.toString());
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div>
            <h1>Home Page</h1>
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Mean</th>
                        <th>Median</th>
                        <th>Standard Deviation</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat, index) => (
                        <tr key={index}>
                            <td>{stat.subject}</td>
                            <td>{stat.mean ? stat.mean.toFixed(2) : 'N/A'}</td>
                            <td>{typeof stat.median === 'number' ? stat.median.toFixed(2) : stat.median}</td>
                            <td>{typeof stat.std === 'number' ? stat.std.toFixed(2) : stat.std}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HomePage;
