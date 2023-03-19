import { API_URL } from "../../settings.js"
import { hideLoading, sanitizeStringWithTableRows, showLoading } from "../../utils.js";
const URL = API_URL + "/cars"

const token = localStorage.getItem("token");
const roles = localStorage.getItem("roles");


export async function initCars() {
    clearTable();
    showLoading();
    if (!token || !roles.includes("ADMIN")) {
      window.router.navigate("/login")
    }
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    try {
      const cars = await fetch(URL, options).then((res) => res.json());
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
