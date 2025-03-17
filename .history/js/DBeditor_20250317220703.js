const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Correct path to your .db file
const dbPath = path.join(__dirname, "../database/historical_yield.db");

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

// Create the historical_yield table if it doesn't exist
const createHistoricalYieldTableQuery = `
    CREATE TABLE IF NOT EXISTS historical_yield (
        Date TEXT PRIMARY KEY,
        Yield_kg_per_hectare REAL NOT NULL
    );
`;

db.run(createHistoricalYieldTableQuery, (err) => {
  if (err) {
    console.error("Error creating historical_yield table:", err.message);
  } else {
    console.log("Historical_yield table created or already exists.");
  }
});

// Log rows before deletion
db.all(
  "SELECT * FROM farmers WHERE Name = 'Lindsey Kagubaton'",
  [],
  (err, rows) => {
    if (err) {
      console.error("Error fetching rows before deletion:", err.message);
    } else {
      console.log("Rows before deletion:", rows);
    }
  }
);

// Delete rows where Name is "Lindsey Kagubaton" and any column is NULL
const deleteQuery = `
    DELETE FROM farmers
    WHERE Name = 'Lindsey Kagubaton'
    AND (Phone_Number IS NULL OR Farm_Size IS NULL OR Average_Yield IS NULL);
`;

db.run(deleteQuery, function (err) {
  if (err) {
    console.error("Error deleting rows:", err.message);
  } else {
    console.log(`Row(s) deleted: ${this.changes}`);
  }
});

// Log rows after deletion
db.all(
  "SELECT * FROM farmers WHERE Name = 'Lindsey Kagubaton'",
  [],
  (err, rows) => {
    if (err) {
      console.error("Error fetching rows after deletion:", err.message);
    } else {
      console.log("Rows after deletion:", rows);
    }
  }
);

// Example: Reading data from the farmers table
db.all("SELECT * FROM farmers", [], (err, rows) => {
  if (err) {
    console.error("Error reading data:", err.message);
  } else {
    console.log("Farmers Data:", rows);
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
