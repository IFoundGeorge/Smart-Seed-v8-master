const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Database Paths
const yieldDbPath = path.join(
  __dirname,
  "..",
  "database",
  "historical_yield.db"
);
const farmersDbPath = path.join(__dirname, "..", "database", "farmers.db");

// Historical Yield Database
const yieldDb = new sqlite3.Database(
  yieldDbPath,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error("❌ Error connecting to historical_yield.db:", err.message);
    } else {
      console.log("✅ Connected to historical_yield.db.");
    }
  }
);

// Farmers Database
const farmersDb = new sqlite3.Database(
  farmersDbPath,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error("❌ Error connecting to farmers.db:", err.message);
    } else {
      console.log("✅ Connected to farmers.db.");
    }
  }
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Fetch historical yield data
app.get("/api/data", (req, res) => {
  const query =
    "SELECT Date, Yield_kg_per_hectare FROM historical_yield ORDER BY Date DESC";
  yieldDb.all(query, [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching data:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Fetch crop distribution
app.get("/api/crop_distribution", (req, res) => {
  farmersDb.all(
    "SELECT Crop_Type AS crop_type, COUNT(*) AS count FROM farmers GROUP BY Crop_Type",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Fetch all farmers
app.get("/api/farmers", (req, res) => {
  const query = "SELECT * FROM farmers WHERE deactivated = 0";
  farmersDb.all(query, [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching farmers:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add a new farmer and update historical yield
app.post("/api/farmers", (req, res) => {
  const { name, location, crop, phone_number, farm_size, average_yield } =
    req.body;

  if (
    !name ||
    !location ||
    !crop ||
    !phone_number ||
    !farm_size ||
    !average_yield
  ) {
    console.error("❌ Missing required fields:", req.body);
    return res.status(400).json({ error: "All fields are required." });
  }

  const insertFarmer = `
        INSERT INTO farmers (Name, Location, Crop_Type, Phone_Number, Farm_Size, Average_Yield)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  farmersDb.run(
    insertFarmer,
    [name, location, crop, phone_number, farm_size, average_yield],
    function (err) {
      if (err) {
        console.error("❌ Error adding farmer:", err.message);
        return res.status(500).json({ error: err.message });
      }

      farmersDb.get(
        "SELECT SUM(Average_Yield) AS totalYield, SUM(Farm_Size) AS totalSize FROM farmers",
        (err, totals) => {
          if (err) {
            console.error("❌ Error calculating total yield:", err.message);
            return res.status(500).json({ error: err.message });
          }

          let yieldPerHectare = totals.totalSize
            ? totals.totalYield / totals.totalSize
            : 0;
          let currentDate = new Date().toISOString().split("T")[0];

          const insertYield = `
            INSERT INTO historical_yield (Date, Yield_kg_per_hectare)
            VALUES (?, ?)
            ON CONFLICT(Date) DO UPDATE SET Yield_kg_per_hectare = excluded.Yield_kg_per_hectare
        `;

          yieldDb.run(
            insertYield,
            [currentDate, yieldPerHectare],
            function (err) {
              if (err) {
                console.error(
                  "❌ Error updating historical yield:",
                  err.message
                );
                return res.status(500).json({ error: err.message });
              }
              res.json({
                message: "Farmer added and historical yield updated!",
              });
            }
          );
        }
      );
    }
  );
});

// Start the server
app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
