document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/api/farmers")
    .then((response) => response.json())
    .then((data) => {
      window.farmersData = data; // Store the data globally
      console.log("Farmers data loaded:", data); // Debugging log
      populateTable(data); // Populate the table with the data
    })
    .catch((error) => {
      console.error("Error fetching farmers:", error);
    });
});

function populateTable(data) {
  let rows = "";
  data.forEach(function (farmer) {
    rows += `<tr data-id="${farmer.id}" data-deactivated="${
      farmer.deactivated
    }">
                    <td>${farmer.Name || ""}</td>
                    <td>${farmer.Location || ""}</td>
                    <td>${farmer.Crop_Type || ""}</td>
                    <td>${farmer.Phone_Number || ""}</td>
                    <td>${farmer.Farm_Size || ""}</td>
                    <td>${farmer.Average_Yield || ""}</td>
                </tr>`;
  });

  $("#dataTable tbody").html(rows);

  let table = $("#dataTable").DataTable();

  // Ensure the correct farmer is selected
  $("#dataTable tbody").on("click", "tr", function () {
    // Remove 'selected' class from all rows
    $("#dataTable tbody tr").removeClass("selected");

    // Add 'selected' class to the clicked row
    $(this).addClass("selected");

    // Get the ID from the clicked row
    const id = parseInt($(this).data("id"), 10);
    console.log("Row clicked, data-id:", id); // Debugging log

    // Find the farmer object from the global farmersData array
    window.selectedFarmer = window.farmersData.find(
      (f) => parseInt(f.id, 10) === id
    );

    if (!window.selectedFarmer) {
      console.error("Farmer not found in farmersData.");
      return; // Safety check
    }

    console.log("Selected Farmer:", window.selectedFarmer); // Debugging log

    // Enable/Disable buttons based on the farmer's status
    if (
      window.selectedFarmer.deactivated == 1 ||
      window.selectedFarmer.deactivated === "1"
    ) {
      $("#deactivateButton").prop("disabled", true);
      $("#activateButton").prop("disabled", false);
    } else {
      $("#deactivateButton").prop("disabled", false);
      $("#activateButton").prop("disabled", true);
    }
  });
}
