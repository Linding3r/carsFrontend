import { API_URL } from "../../settings.js"
import { hideLoading, sanitizeStringWithTableRows, showLoading } from "../../utils.js";
const URL = API_URL + "/members"

export async function initMembers(){
    showLoading();
    const members = await fetch(URL).then((res) => res.json());
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