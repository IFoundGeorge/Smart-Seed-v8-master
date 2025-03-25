$(document).ready(function () {
  fetch("http://localhost:3000/api/farmers")
    .then((response) => response.json())
    .then((data) => {
      console.log("Farmers data:", data); // Debugging log
      window.farmersData = data; // Store globally

      let rows = "";
      data.forEach(function (farmer) {
        // Add the 'deactivated' class if the farmer is deactivated
        const rowClass = farmer.deactivated == 1 ? "deactivated" : "";

        rows += `<tr data-id="${farmer.id}" data-deactivated="${
          farmer.deactivated
        }" class="${rowClass}">
                    <td>${farmer.Name || ""}</td>
                    <td>${farmer.Location || ""}</td>
                    <td>${farmer.Crop_Type || ""}</td>
                    <td>${farmer.Phone_Number || ""}</td>
                    <td>${farmer.Farm_Size || ""}</td>
                    <td>${farmer.Average_Yield || ""}</td>
                </tr>`;
      });

      // Populate the table body
      $("#dataTable tbody").html(rows);

      // Initialize DataTable
      let table = $("#dataTable").DataTable();

      // Reapply the 'deactivated' class after DataTable initialization
      data.forEach(function (farmer) {
        if (farmer.deactivated == 1) {
          $(`#dataTable tbody tr[data-id="${farmer.id}"]`).addClass(
            "deactivated"
          );
        }
      });

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
    })
    .catch((error) => console.error("Error fetching farmers data:", error));
});
