// @ts-nocheck

import { API_URL } from "../../settings.js"
import { hideLoading, sanitizeStringWithTableRows, showLoading, handleHttpErrors } from "../../utils.js";
const URL = API_URL + "/cars"
const RES_URL = API_URL + "/reservations"

const token = localStorage.getItem("token");
const roles = localStorage.getItem("roles");

export async function initReservation() {
  if (!token || !roles.includes("USER")) {
    window.router.navigate("/login")
    alert("Login to view this page")
  } else{
    getCars();
    document.getElementById("table-rows").onclick = setupReservationModal;
    document
      .getElementById("btn-reservation")
      .addEventListener("click", reserveCar);
    }
  }
  
  export async function getCars() {
    showLoading();
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    try {
      const cars = await fetch(URL, options).then((res) => res.json());
      const tableRowsStr = cars
        .map(
          (car) => `
            <tr>
              <td>${car.id}</td>
              <td>${car.brand}</td>
              <td>${car.model}</td>
              <td>${car.pricePrDay}</td>
              <td>
                <button data-car-id="${car.id}" type="button" class="btn btn-dark btn-primary row-btn-details">Reserve</button>
              </td>
            </tr>`
        )
        .join("");
  
      const okRows = sanitizeStringWithTableRows(tableRowsStr);
      document.getElementById("table-rows").innerHTML = okRows;
    } catch (error) {
      alert("An error occurred while fetching cars.");
    } finally {
      hideLoading();
    }
  }
  
  async function setupReservationModal(evt) {
    const target = evt.target;
    if (!target.classList.contains("row-btn-details")) {
      return;
    }
    const carId = target.getAttribute("data-car-id");
    const carDetails = await getCarDetails(carId);
    showReservationModal(carDetails);
  }
  
  async function getCarDetails(carId) {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    };
    try {
      const response = await fetch(`${URL}/${carId}`, options);
      const carDetails = await response.json();
      return carDetails;
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching car details.");
    }
  }
  
  function showReservationModal(carDetails) {
    const modalTitle = document.getElementById("reservation-modal-label");
    const carIdInput = document.getElementById("car-id");
    const reservationDateInput = document.getElementById("reservation-date");
  
    modalTitle.innerText = `Reserve ${carDetails.brand} ${carDetails.model}`;
    carIdInput.value = carDetails.id;
    reservationDateInput.value = "";
  
    const reservationModal = new bootstrap.Modal(
      document.getElementById("reservation-modal")
    );
    reservationModal.show();
    const reservationBtn = document.getElementById("btn-reservation");
    reservationBtn.onclick = async function () {
      reservationModal.hide();
    };
  }
  
  export async function reserveCar() {
    const carId = document.getElementById("car-id").value;
    const reservationDate = document.getElementById("reservation-date").value;
    const username = localStorage.getItem("user");
  
    const reservation = {
      username: username,
      carId: carId,
      rentalDate: reservationDate,
    };
  
    console.log(JSON.stringify(reservation));
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservation),
    };

    try {
      await fetch(RES_URL, options).then(handleHttpErrors);
      alert("Reservation added successfully");
    } catch (error) {
      console.error(error);
      if(error.message === "given date and car is already reserved"){
        alert("The given car is already reserved for the given date.");
      } else {
      alert("An error occurred while reserving car.");
    }
    }
  }