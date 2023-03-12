// @ts-nocheck
import { API_URL} from "../../settings.js"
import { encode } from "../../utils.js";


const URL = API_URL + "/members"


export function initSignup() {
    clearInput();
    document.getElementById("btn-signup").onclick = signup;
    document.getElementById("btn-signup").disabled = true;
    const inputs = document.querySelectorAll('#form input[required]');
    const submitButton = document.querySelector('#btn-signup');
  
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
        submitButton.disabled = !allFilled;
      });
    });
}



function signup(evt) {
    const errorTxt = document.getElementById("error-msg");
    const member = {
        username: encode(document.getElementById("input-username").value),
        email: encode(document.getElementById("input-email").value),
        password: document.getElementById("input-password").value,
        firstName: encode(document.getElementById("input-firstname").value),
        lastName: encode(document.getElementById("input-lastname").value),
        street: encode(document.getElementById("input-street").value),
        city: encode(document.getElementById("input-city").value),
        zip: encode(document.getElementById("input-zip").value)
    };
    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(member),
        });
        if (!res.ok) {
            const errorData = await res.json();
            if(errorData.message === "Member with this ID already exist") {
            throw new Error("API Error - " + res.status + " - " + errorData.message);
            } 
            else if(errorData.message === "Member with this Email already exist") {
            throw new Error("API Error - " + res.status + " - " + errorData.message);
            } 
            else {
            throw new Error("Failed to create member");
            }
        }
        clearInput();
    } catch (err) {
        console.error("Error:", err.message);
        if (err.message.includes("Member with this ID already exist")) {
        errorTxt.innerText = "Username already taken";
        document.getElementById("input-username").value = "";   
        }
        if (err.message.includes("Member with this Email already exist")) {
        errorTxt.innerText = "Email already in use";
        document.getElementById("input-email").value = "";
        }
    }
}


function clearInput(){
    document.getElementById("input-username").value = "";
    document.getElementById("input-email").value = "";
    document.getElementById("input-password").value = "";
    document.getElementById("input-firstname").value = "";
    document.getElementById("input-lastname").value = "";
    document.getElementById("input-street").value = "";
    document.getElementById("input-city").value = "";
    document.getElementById("input-zip").value = "";
}