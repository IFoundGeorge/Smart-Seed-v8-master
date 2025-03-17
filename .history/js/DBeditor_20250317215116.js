const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Correct path to your .db file
const dbPath = path.join(__dirname, "../database/farmers.db");

// Open the database
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the farmers database.");
  }
});

// Create the farmers table if it doesn't exist
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS farmers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Location TEXT NOT NULL,
        Crop_Type TEXT NOT NULL,
        Phone_Number TEXT NOT NULL,
        Farm_Size REAL NOT NULL,
        Average_Yield REAL NOT NULL,
        deactivated INTEGER DEFAULT 0
    );
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Farmers table created or already exists.");
  }
});

// Delete rows where Name is "Lindset Kagubaton" and any column is NULL
const deleteQuery = `
    DELETE FROM farmers
    WHERE Name = 'Lindset Kagubaton'
    AND (Location IS NULL OR Crop_Type IS NULL OR Phone_Number IS NULL OR Farm_Size IS NULL OR Average_Yield IS NULL);
`;

db.run(deleteQuery, function (err) {
  if (err) {
    console.error("Error deleting rows:", err.message);
  } else {
    console.log(`Row(s) deleted: ${this.changes}`);
  }
});

// Example: Reading data from the farmers table
db.all("SELECT * FROM farmers", [], (err, rows) => {
  if (err) {
    console.error("Error reading data:", err.message);
  } else {
    console.log("Farmers Data:", rows);
  }
});

// Example: Updating data in the farmers table
const updateQuery = `UPDATE farmers SET Name = ? WHERE id = ?`;
db.run(updateQuery, ["Updated Name", 1], function (err) {
  if (err) {
    console.error("Error updating data:", err.message);
  } else {
    console.log(`Row(s) updated: ${this.changes}`);
  }
});

// Close the database
db.close((err) => {
  if (err) {
    console.error("Error closing database:", err.message);
  } else {
    console.log("Database connection closed.");
  }
});
