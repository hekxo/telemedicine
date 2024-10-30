const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Path to the file where records will be saved
const dataFilePath = path.join(__dirname, 'data.json');

// Read existing data from the file or initialize with an empty array
const readData = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data:", error); // Log the error
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log("Data successfully written to data.json.");
    } catch (error) {
        console.error("Error writing data:", error);
    }
};



// Endpoint to save a new card
app.post('/save-card', (req, res) => {
    console.log("Received data:", req.body); // Log the received data

    const { patientId, patientInfo, medicalNotes, complaints } = req.body;
    const newCard = {
        patientId,
        patientInfo,
        medicalNotes,
        complaints,
        timestamp: new Date().toISOString()
    };

    const data = readData();
    console.log("Current data in file:", data); // Log current data from the file

    data.push(newCard);
    writeData(data);

    console.log("Data after adding new card:", data); // Log data after pushing new card

    res.status(200).json({ message: 'Card saved successfully', card: newCard });
});

// Endpoint to retrieve all cards
app.get('/get-cards', (req, res) => {
    const data = readData();
    res.status(200).json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
