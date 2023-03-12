import { API_URL } from "../../settings.js"
import { hideLoading, sanitizeStringWithTableRows, showLoading } from "../../utils.js";
const URL = API_URL + "/cars"

export async function initCars() {
    clearTable();
    showLoading();
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const cars = await fetch(URL).then((res) => res.json());
      showCars(cars);
    } catch (err) {
      hideLoading();
      alert(err.message)
    } finally {
      hideLoading();
    }
  }


  function showCars(cars){
    const tableRows = cars.map((car) => `
      <tr>
        <td>${car.id}</td>
        <td>${car.brand}</td>
        <td>${car.model}</td>
        <td>${car.pricePrDay}</td>
        <td>${car.bestDiscount}</td>
      </tr>`
      ).join("");
    const tableRowsSan = sanitizeStringWithTableRows(tableRows);
    document.getElementById("table-rows").innerHTML = tableRowsSan;
  }

  function clearTable(){
    document.getElementById("table-rows").innerHTML = "";
  }
