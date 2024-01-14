const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require('cors'); // Make sure this line is included

const port = 3000;
app.use(cors());

const db = new sqlite3.Database('mydatabase.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS subjectData (subject TEXT, grade INTEGER, desc TEXT)');
});

app.use(bodyParser.json());

app.post('/api/add', (req, res) => {
    const { subject, grade, desc } = req.body;

    db.run('INSERT INTO subjectData (subject, grade, desc) VALUES (?, ?, ?)', [subject, grade, desc], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.sendStatus(200);
        }
    });
});

app.get('/api/stats', (req, res) => {
    console.log("API /stats called");
    db.all('SELECT subject, AVG(grade) AS mean FROM subjectData GROUP BY subject', (err, meanRows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const promises = meanRows.map(meanRow => {
            const subject = meanRow.subject;
            return new Promise((resolve, reject) => {
                db.all('SELECT grade FROM subjectData WHERE subject = ?', [subject], (err, gradeRows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        const grades = gradeRows.map(row => row.grade);
                        const mean = meanRow.mean;

                        // Calculate median
                        const sortedGrades = grades.slice().sort((a, b) => a - b);
                        const middle = Math.floor(sortedGrades.length / 2);
                        const median = (sortedGrades.length % 2 === 0)
                            ? (sortedGrades[middle - 1] + sortedGrades[middle]) / 2
                            : sortedGrades[middle];

                        // Calculate standard deviation
                        const squaredDifferences = grades.map(grade => Math.pow(grade - mean, 2));
                        const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / grades.length;
                        const std = Math.sqrt(variance);

                        const result = {
                            subject,
                            mean: meanRow.mean,
                            median: median.toFixed(2) || 'N/A',
                            std: std.toFixed(2) || 'N/A'
                        };
                        resolve(result);
                    }
                });
            });
        });

        Promise.all(promises)
            .then(data => {
                console.log("Data returned:", data);
                res.json(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
