import React, { useState } from 'react';

function InputPage() {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [desc, setDesc] = useState('');

    const handleAddData = () => {
        // Send a POST request to add data to the backend
        fetch('http://localhost:3000/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject, grade, desc }),
        })

            .then((response) => {
                if (response.ok) {
                    console.log('Data added successfully.');
                    // Clear input fields after successful submission
                    setSubject('');
                    setGrade('');
                    setDesc('');
                } else {
                    console.error('Failed to add data.');
                }
            });
    };

    return (
        <div>
            <h1>Input Page</h1>
            <div>
                <label>Subject: </label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
                <label>Grade: </label>
                <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>

            <button onClick={handleAddData}>Add Data</button>
        </div>
    );
}

export default InputPage;
