import { API_URL} from "../../settings.js"
import { hideLoading, sanitizeStringWithTableRows, showLoading } from "../../utils.js";
const URL = API_URL + "/reservations/member/"
const token = localStorage.getItem("token");
const roles = localStorage.getItem("roles");

export async function initListReservationsAll() {
    showLoading();
    if (!token || !roles.includes("USER")) {
      window.router.navigate("/")
      alert("You do not have permission to view this page")
    }
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    const username = localStorage.getItem("user");
    let reservations = null;
    if(roles.includes("ADMIN")){
      reservations = await fetch(API_URL + "/reservations", options ).then((res) => res.json());
  } else {
  reservations = await fetch(URL + username, options ).then((res) => res.json());
}
    const tableRows = reservations
      .map(
        (reservation) => `
          <tr>
          <td>${reservation.carId}</td>
          <td>${reservation.carBrand}</td>
          <td>${reservation.carModel}</td>
          <td>${reservation.reservationDate}</td>
          <td>${reservation.rentalDate}</td>
          <td>${reservation.price} DKK/day</td>
      </tr>`
      )
      .join("");
    hideLoading();
    const tableRowsSan = sanitizeStringWithTableRows(tableRows);
    document.getElementById("tbody").innerHTML = tableRowsSan;
}

