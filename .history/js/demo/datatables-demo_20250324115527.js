$(document).ready(function () {
  fetch("http://localhost:3000/api/farmers")
    .then((response) => response.json())
    .then((data) => {
      console.log("Farmers data:", data); // Debugging log
      window.farmersData = data; // Store globally

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
        $("#dataTable tbody tr").removeClass("selected");
        $(this).addClass("selected");

        const id = parseInt($(this).data("id"), 10);
        window.selectedFarmer = window.farmersData.find(
          (f) => parseInt(f.id, 10) === id
        );

        if (!window.selectedFarmer) return; // Safety check
        console.log("Selected Farmer:", window.selectedFarmer); // Debugging log

        // Enable/Disable buttons based on status
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
