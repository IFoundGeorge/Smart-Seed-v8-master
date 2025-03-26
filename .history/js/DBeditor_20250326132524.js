const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Paths to your database files
const farmersDbPath = path.join(__dirname, "../database/farmers.db");

// Open the farmers database
let farmersDb = new sqlite3.Database(farmersDbPath, (err) => {
  if (err) {
    console.error("Error opening farmers database:", err.message);
  } else {
    console.log("Connected to the farmers database.");
  }
});

// Migrate the farmers table to include an auto-incrementing id column
farmersDb.serialize(() => {
  // Create a new table with the correct schema
  const createFarmersNewTableQuery = `
    CREATE TABLE IF NOT EXISTS farmers_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT,
        Location TEXT,
        Crop_Type TEXT,
        Phone_Number INTEGER,
        Farm_Size REAL,
        Average_Yield REAL,
        deactivated INTEGER DEFAULT 0
    );
  `;
  farmersDb.run(createFarmersNewTableQuery, (err) => {
    if (err) {
      console.error("Error creating farmers_new table:", err.message);
    } else {
      console.log("farmers_new table created.");
    }
  });

  // Copy data from the old table to the new table
  const copyDataQuery = `
    INSERT INTO farmers_new (Name, Location, Crop_Type, Phone_Number, Farm_Size, Average_Yield, deactivated)
    SELECT Name, Location, Crop_Type, Phone_Number, Farm_Size, Average_Yield, deactivated
    FROM farmers;
  `;
  farmersDb.run(copyDataQuery, (err) => {
    if (err) {
      console.error("Error copying data to farmers_new table:", err.message);
    } else {
      console.log("Data copied to farmers_new table.");
    }
  });

  // Drop the old table
  const dropOldTableQuery = `DROP TABLE farmers;`;
  farmersDb.run(dropOldTableQuery, (err) => {
    if (err) {
      console.error("Error dropping old farmers table:", err.message);
    } else {
      console.log("Old farmers table dropped.");
    }
  });

  // Rename the new table to the original name
  const renameTableQuery = `ALTER TABLE farmers_new RENAME TO farmers;`;
  farmersDb.run(renameTableQuery, (err) => {
    if (err) {
      console.error(
        "Error renaming farmers_new table to farmers:",
        err.message
      );
    } else {
      console.log("farmers_new table renamed to farmers.");
    }
  });

  // Update all farmers to set deactivated = 0
  const updateDeactivatedQuery = `
    UPDATE farmers
    SET deactivated = 0;
  `;

  farmersDb.run(updateDeactivatedQuery, function (err) {
    if (err) {
      console.error(
        "Error updating deactivated status for all farmers:",
        err.message
      );
    } else {
      console.log(`Rows updated: ${this.changes}`); // Debugging log
      console.log("All farmers' deactivated status set to 0.");
    }
  });
});

// Close the farmers database
farmersDb.close((err) => {
  if (err) {
    console.error("Error closing farmers database:", err.message);
  } else {
    console.log("Farmers database connection closed.");
  }
});

// Open the historical_yield database
const historicalYieldDbPath = path.join(
  __dirname,
  "../database/historical_yield.db"
);
let historicalYieldDb = new sqlite3.Database(historicalYieldDbPath, (err) => {
  if (err) {
    console.error("Error opening historical_yield database:", err.message);
  } else {
    console.log("Connected to the historical_yield database.");
  }
});

// Fix the historical_yield table schema
historicalYieldDb.serialize(() => {
  // Rename the existing table (if it exists)
  historicalYieldDb.run(
    `ALTER TABLE historical_yield RENAME TO historical_yield_old`,
    (err) => {
      if (err) {
        console.error("Error renaming historical_yield table:", err.message);
      } else {
        console.log("Renamed historical_yield table to historical_yield_old.");
      }
    }
  );

  // Create the new table with the correct schema
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
      console.log("Historical_yield table created with the correct schema.");
    }
  });

  // Copy data from the old table to the new table
  const copyDataQuery = `
      INSERT INTO historical_yield (Date, Yield_kg_per_hectare)
      SELECT Date, Yield_kg_per_hectare FROM historical_yield_old;
  `;
  historicalYieldDb.run(copyDataQuery, (err) => {
    if (err) {
      console.error(
        "Error copying data to new historical_yield table:",
        err.message
      );
    } else {
      console.log("Data copied to new historical_yield table.");
    }
  });

  // Drop the old table
  historicalYieldDb.run(`DROP TABLE historical_yield_old`, (err) => {
    if (err) {
      console.error("Error dropping historical_yield_old table:", err.message);
    } else {
      console.log("Dropped historical_yield_old table.");
    }
  });
});

// Close the historical_yield database
historicalYieldDb.close((err) => {
  if (err) {
    console.error("Error closing historical_yield database:", err.message);
  } else {
    console.log("Historical_yield database connection closed.");
  }
});
