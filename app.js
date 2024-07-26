const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const studentinformation = require('./Models/studentinformation');
const dotenv = require('dotenv');
app.use(express.json());
dotenv.config();

const uri = process.env.mongodb_uri;
mongoose.connect(uri);

const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error);
});
database.once("connected", () => {
    console.log("Database Connected");
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'addstudent.html'));
});

app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submitted.html'));
});

app.get('/student/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewstudent.html'));
});






app.post('/submit', async (req, res) => {
    try {
        const data = req.body;
        const result = await studentinformation.create(data);
        console.log(result);
         res.status(201).redirect('/thank-you');
        res.json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
});



app.get('/read', async (req, res) => {

    const id = req.params.id;
    console.log(id);
    const details = await studentinformation.find({});
    console.log("details", details);
    res.json(details);

})


app.get('api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const details = await studentinformation.findOne({ studentID: id });
        if (details) {
            res.json(details);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/student/:grade', async (req, res) => {
    try {
        const grade = req.params.grade;
        const details = await studentinformation.find({ Grade: grade });
        if (details) {
            res.json(details);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/student/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const updatedDetails = await studentinformation.findOneAndUpdate({ studentID: id }, updatedData, options);

        if (updatedDetails) {
            res.status(200).json(updatedDetails);
        } else {
            res.status(404).json({ message: 'Student with ID not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/student/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedDetails = await studentinformation.findOneAndDelete({ studentID: id });

        if (deletedDetails) {
            res.status(200).json({ message: 'Student Details deleted successfully' });
        } else {
            res.status(404).json({ message: 'Student Details not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});








const PORT = 3005;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});