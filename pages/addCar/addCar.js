// @ts-nocheck

import { API_URL,FETCH_NO_API_ERROR } from "../../settings.js"
import { encode} from "../../utils.js";
const URL = API_URL + "/cars"

const token = localStorage.getItem("token");
const roles = localStorage.getItem("roles");

export async function initAddCar(match) {
  clearInput();
  clearMsg();
  if (!token || !roles.includes("ADMIN")) {
    window.router.navigate("/login")
  }
  document.getElementById("btn-submit-car").onclick = addCar;
  const inputs = document.querySelectorAll('#form input[required]');
  const submitButton = document.querySelector('#btn-submit-car');

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
      submitButton.disabled = !allFilled;
    });
  });
}

function addCar(evt){
const car = {
    brand: encode(document.getElementById("brand").value),
    model: encode(document.getElementById("model").value),
    pricePrDay: encode(document.getElementById("price-pr-day").value),
    bestDiscount: encode(document.getElementById("best-discount").value)
  };

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(car),
  })
    .then((res) => res.json())
    .then((car) => {
      document.getElementById("success-msg").innerText = "Added following car:"
      document.getElementById("added-car").innerHTML = 
      `Brand: ${car.brand} - Model: ${car.model} - 
      Price Per day: ${car.pricePrDay} - Best Discount: ${car.bestDiscount}`;
      clearInput()
    })
    .catch((error) => {
      document.getElementById("error-msg").innerText = error
      clearInput()
    });
}

  function clearInput(){
    document.getElementById("brand").value = ""
    document.getElementById("model").value = ""
    document.getElementById("price-pr-day").value = ""
    document.getElementById("best-discount").value = ""
}

 function clearMsg(){
  document.getElementById("success-msg").innerText = ""
  document.getElementById("error-msg").innerText = ""
  document.getElementById("added-car").innerHTML = ""
}
