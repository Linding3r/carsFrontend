import { API_URL} from "../../settings.js"
import { hideLoading, sanitizeStringWithTableRows, showLoading } from "../../utils.js";
const URL = API_URL + "/reservations"

export async function initListReservationsAll() {
    showLoading();
    const reservations = await fetch(URL).then((res) => res.json());
    const tableRows = reservations
      .map(
        (reservation) => `
          <tr>
          <td>${reservation.carId}</td>
          <td>${reservation.carBrand}</td>
          <td>${reservation.carModel}</td>
          <td>${reservation.reservationDate}</td>
          <td>${reservation.price} DKK/day</td>
      </tr>`
      )
      .join("");
    hideLoading();
    const tableRowsSan = sanitizeStringWithTableRows(tableRows);
    document.getElementById("tbody").innerHTML = tableRowsSan;
}

