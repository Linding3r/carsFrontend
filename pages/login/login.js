// @ts-nocheck
import { API_URL} from "../../settings.js"
import {handleHttpErrors} from "../../utils.js"

const URL = API_URL + "/auth/login";

export function initLogin() {
	document.getElementById("login-btn").onclick = login;
}

export function logout() {
	window.router.navigate("/login");
	document.querySelectorAll("#admin-nav").forEach(item => item.style.display = "none");
	document.querySelectorAll(".nav-item").forEach(item => item.style.display = "none");
	document.getElementById("login-id").style.display = "block";
	document.getElementById("signup").style.display = "block";
	localStorage.clear();
}

async function login(evt) {
	document.getElementById("error").innerHTML = "";
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const options = { 
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, password })
	}
	try{
		const response = await fetch(URL, options).then(res => handleHttpErrors(res))
		localStorage.setItem("user", response.username)
		localStorage.setItem("token", response.token)
		localStorage.setItem("roles", response.roles)

		document.getElementById("login-id").style.display = "none";
		document.getElementById("logout-id").style.display = "block";
		window.router.navigate("")
		location.reload();
	} catch (error) {
		document.getElementById("error").innerHTML = error.message;
	}
}

export function checkAuth(roles = []) {
	return (done, match) => {
	  const token = localStorage.getItem("token")
	  const userRoles = localStorage.getItem("roles")
	  if (!token || !userRoles) {
		window.router.navigate("/login")
		return
	  }
	  const authorized = roles.some(role => userRoles.includes(role))
	  if (!authorized) {
		window.router.navigate("/")
		return
	  }
	  done()
	}
  }