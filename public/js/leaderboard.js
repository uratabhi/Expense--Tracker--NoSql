const tbody = document.getElementById("tbodyId");
const logoutBtn = document.getElementById("logoutbtn");

document.addEventListener("DOMContentLoaded", showLeaderBoard);

async function showLeaderBoard(e) {
   e.preventDefault();
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/premium/showLeaderBoard", {
    headers: { Authorization: token },
  });
  let position = 1;
  res.data.forEach((data) => {
    let tr = document.createElement("tr");
    tbody.appendChild(tr);

    let td1 = document.createElement('td');
    td1.appendChild(document.createTextNode(position++));

    let td2 = document.createElement("td");
    td2.appendChild(document.createTextNode(data.Name));

    let td3 = document.createElement("td");
    td3.appendChild(document.createTextNode(data.totalExpenses));

     tr.appendChild(td1);
     tr.appendChild(td2);
     tr.appendChild(td3);
  });
}

logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    console.log('Logout button clicked');
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/user/logout',  { headers: { Authorization: token } })
      localStorage.clear();
      window.location.href = '/';
  } catch (error) {
    console.log('Error during logout:', error);
  }
});
