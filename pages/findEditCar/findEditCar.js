// @ts-nocheck
import { API_URL} from "../../settings.js"
import { hideLoading, sanitizeStringWithTableRows, showLoading } from "../../utils.js";

const URL = `${API_URL}/cars`

export function initFindEditCar(){
    clearInput();
    hideBox()
    document.getElementById("btn-fetch-car").onclick = findCarToEdit
    document.getElementById("btn-submit-edited-car").onclick = editCar
    document.getElementById("btn-delete-car").onclick = deleteCar
}

function findCarToEdit(evt){
    const id = document.getElementById("car-id-input").value
    showLoading();
    if(!id){
     alert("Enter a Car id")
     hideLoading();
     return 
    }
    fetch(URL+"/"+id)
    .then(res => {
     if(!res.ok){
         return Promise.reject("Car Not Found") 
     }
     return res.json()})
    .then(data => {
    showBox();
    hideLoading();
     document.getElementById("brand").value = data.brand;
     document.getElementById("car-id").value = data.id;
     document.getElementById("model").value = data.model;
     document.getElementById("price-pr-day").value = data.pricePrDay;
     document.getElementById("best-discount").value = data.bestDiscount;
    })
    .catch((error) => {
     document.getElementById("c-error2").innerText = error
     clearInput();
     hideBox();
     hideLoading();
    })
}

function editCar(evt){
    const car = {
        brand: document.getElementById("brand").value,
        id: document.getElementById("car-id").value,
        model: document.getElementById("model").value,
        pricePrDay: document.getElementById("price-pr-day").value,
        bestDiscount: document.getElementById("best-discount").value
      };
       fetch(URL + "/" + car.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(car),
      })
        .then((res) => {
            clearInput();
            hideBox();
            document.getElementById("success-msg").innerText = "Car successfully edited"
})
        .catch((error) => {
          console.log(error);
        });
    }

    function deleteCar(evt){
        const id = document.getElementById("car-id-input").value;
        fetch(URL + "/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          clearInput();
          hideBox();
          document.getElementById("success-msg").innerText = "Car successfully deleted!"
        })
        .catch((error) => {
          console.log(error);
        });
      }


function clearInput(){
    document.getElementById("brand").value = ""
    document.getElementById("car-id").value = ""
    document.getElementById("model").value = ""
    document.getElementById("price-pr-day").value = ""
    document.getElementById("best-discount").value = ""
    document.getElementById("car-id-input").value = ""
    document.getElementById("success-msg").innerText = ""
    document.getElementById("c-error2").innerText = ""
}

function showBox() {
    document.getElementById('car_info_box').style.display = 'block';
  }
  
function hideBox() {
    document.getElementById('car_info_box').style.display = 'none';
  }