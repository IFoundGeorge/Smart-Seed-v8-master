const sqlite3 = require("sqlite3").verbose();

// Path to your .db file
const dbPath = "../database/farners.db";

// Open the database
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the database.");
  }
});

// Example: Reading data from a table
db.all("SELECT * FROM your_table_name", [], (err, rows) => {
  if (err) {
    console.error("Error reading data:", err.message);
  } else {
    console.log("Data:", rows);
  }
});

// Example: Updating data in a table
const updateQuery = `UPDATE your_table_name SET column_name = ? WHERE id = ?`;
db.run(updateQuery, ["new_value", 1], function (err) {
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
