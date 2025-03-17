const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Paths to your database files
const farmersDbPath = path.join(__dirname, "../database/farmers.db");
const historicalYieldDbPath = path.join(
  __dirname,
  "../database/historical_yield.db"
);

// Open the farmers database
let farmersDb = new sqlite3.Database(farmersDbPath, (err) => {
  if (err) {
    console.error("Error opening farmers database:", err.message);
  } else {
    console.log("Connected to the farmers database.");
  }
});

// Create the farmers table if it doesn't exist
const createFarmersTableQuery = `
    CREATE TABLE IF NOT EXISTS farmers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Location TEXT NOT NULL,
        Crop_Type TEXT NOT NULL,
        Phone_Number TEXT,
        Farm_Size REAL,
        Average_Yield REAL,
        deactivated INTEGER DEFAULT 0
    );
`;

farmersDb.run(createFarmersTableQuery, (err) => {
  if (err) {
    console.error("Error creating farmers table:", err.message);
  } else {
    console.log("Farmers table created or already exists.");
  }
});

// Log rows before deletion
farmersDb.all(
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

farmersDb.run(deleteQuery, function (err) {
  if (err) {
    console.error("Error deleting rows:", err.message);
  } else {
    console.log(`Row(s) deleted: ${this.changes}`);
  }
});

// Log rows after deletion
farmersDb.all(
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

// Close the farmers database
farmersDb.close((err) => {
  if (err) {
    console.error("Error closing farmers database:", err.message);
  } else {
    console.log("Farmers database connection closed.");
  }
});

// Open the historical_yield database
let historicalYieldDb = new sqlite3.Database(historicalYieldDbPath, (err) => {
  if (err) {
    console.error("Error opening historical_yield database:", err.message);
  } else {
    console.log("Connected to the historical_yield database.");
  }
});

// Create the historical_yield table if it doesn't exist
const createHistoricalYieldTableQuery = `
    CREATE TABLE IF NOT EXISTS historical_yield (
        Date TEXT PRIMARY KEY,
        Yield_kg_per_hectare REAL NOT NULL
    );
`;

historicalYieldDb.run(createHistoricalYieldTableQuery, (err) => {
  if (err) {
    console.error("Error creating historical_yield table:", err.message);
  } else {
    console.log("Historical_yield table created or already exists.");
  }
});

const insertYield = `
    INSERT INTO historical_yield (Date, Yield_kg_per_hectare)
    VALUES (?, ?)
    ON CONFLICT(Date) DO UPDATE SET Yield_kg_per_hectare = excluded.Yield_kg_per_hectare
`;

// Close the historical_yield database
historicalYieldDb.close((err) => {
  if (err) {
    console.error("Error closing historical_yield database:", err.message);
  } else {
    console.log("Historical_yield database connection closed.");
  }
});
