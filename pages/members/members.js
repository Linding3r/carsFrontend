import { API_URL } from "../../settings.js"
import { hideLoading, sanitizeStringWithTableRows, showLoading } from "../../utils.js";
const URL = API_URL + "/members"

const token = localStorage.getItem("token");
const roles = localStorage.getItem("roles");


export async function initMembers(){
    showLoading();
    if (!token || !roles.includes("ADMIN")) {
        window.router.navigate("/")
      alert("You do not have permission to view this page")
    }
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    const members = await fetch(URL, options).then((res) => res.json());
    const tableRows = members
      .map(
        (member) => `
          <tr>
          <td>${member.username}</td>
          <td>${member.email}</td>
          <td>${member.firstName}</td>
          <td>${member.lastName}</td>
          <td>${member.city}</td>
      </tr>`
      )
      .join("");
    hideLoading();
    const tableRowsSan = sanitizeStringWithTableRows(tableRows);
    document.getElementById("tbody").innerHTML = tableRowsSan;
}