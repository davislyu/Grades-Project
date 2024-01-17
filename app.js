const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS subjectData (subject TEXT, grade INTEGER, desc TEXT)');
});

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

app.delete('/api/delete/:subject', (req, res) => {
    const { subject } = req.params;
    db.run('DELETE FROM subjectData WHERE subject = ?', [subject], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.sendStatus(200);
        }
    });
});

app.get('/api/stats', (req, res) => {
    db.all('SELECT subject, AVG(grade) AS mean FROM subjectData GROUP BY subject', (err, meanRows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const promises = meanRows.map(meanRow => {
            const subject = meanRow.subject;
            return new Promise((resolve, reject) => {
                db.all('SELECT grade, desc FROM subjectData WHERE subject = ?', [subject], (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        const grades = rows.map(row => row.grade);
                        let median = 0;
                        if (grades.length) {
                            const sortedGrades = grades.slice().sort((a, b) => a - b);
                            const middle = Math.floor(sortedGrades.length / 2);
                            median = sortedGrades.length % 2 !== 0
                                ? sortedGrades[middle]
                                : (sortedGrades[middle - 1] + sortedGrades[middle]) / 2;
                        }

                        // Calculate standard deviation
                        const squaredDifferences = grades.map(grade => Math.pow(grade - meanRow.mean, 2));
                        const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / grades.length;
                        const std = Math.sqrt(variance);

                        const result = {
                            subject,
                            mean: parseFloat(meanRow.mean.toFixed(2)),
                            median: parseFloat(median.toFixed(2)),
                            std: parseFloat(std.toFixed(2)),
                            desc: rows[0]?.desc
                        };
                        resolve(result);
                    }
                });
            });
        });

        Promise.all(promises)
            .then(data => res.json(data))
            .catch(error => {
                console.error('Error fetching data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
