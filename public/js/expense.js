var rzpybtn = document.getElementById("rzpy-btn");
var addBtn = document.querySelector("#add-btn");
var downloadBtn = document.getElementById("reports");
var table = document.getElementById('tbody');
var show = document.getElementById('show');
const reportsLink = document.getElementById("reportslink");
const leaderboardLink = document.getElementById("leaderboardlink");
const logoutBtn = document.getElementById("logoutbtn");
const dp = document.getElementById('dynamicpagination');


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


dp.addEventListener('click', ()=>{
  const dpvalue = dp.value;
  localStorage.setItem('dynamicPagination', dpvalue);
  window.location.reload();
})


async function downloadFiles(e){
  const token = localStorage.getItem('token');
  const res = await axios.get("http://localhost:3000/expense/download", {
    headers: { Authorization: token },
  });
  if(res.status===200){
    var a = document.createElement('a');
    a.href = res.data.fileUrl;
    a.download = 'myexpense.csv';
    a.click();
  }
  else{
     console.log('errror has occuered from the backend server');
  }
}

async function addExpense(e) {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const res = await axios.post(
      "http://localhost:3000/expense/addExpense",
      {
        amount,
        description,
        category,
      },
      { headers: { Authorization: token } }
    );
    if (res.status == 200) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}


async function showfiledownloaded(e) {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:3000/premium/showfiledownloaded",
      {
        headers: { Authorization: token },
      }
    );
    var ptr = 1;

    res.data.data.forEach((data) => {
      const parentNode = document.getElementById("downloads");
      const childNode = document.createElement("li");
      var text = `(${ptr++}) fileurl - ${data.fileurl} - createdAt ${
        data.createdAt
      }`;
      childNode.appendChild(document.createTextNode(text));
      parentNode.appendChild(childNode);
    });
  } catch (error) {
    console.log(error);
  }
}


async function premiumMemberShip(e) {
   e.preventDefault();
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: response.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert(
        "Welcome to our Premium Membership, You have now Excess to Reports and LeaderBoard"
      );
      window.location.reload();
      localStorage.setItem("token", res.data.token);
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}

async function isPremiumUser() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/user/isPremiumUser", {
    headers: { Authorization: token },
  });
  if (res.data.isPremiumUser) {
    rzpybtn.innerHTML = "Premium Member &#128081";
    reportsLink.removeAttribute("onclick");
    leaderboardLink.removeAttribute("onclick");
    leaderboardLink.setAttribute("href", "/reports/getLeaderboardPage");
    reportsLink.setAttribute("href", "/reports/getReportsPage");
    rzpybtn.removeEventListener("click", premiumMemberShip);
  }
}



async function getAllExpenses(e) {
  try {
    const token = localStorage.getItem("token");
    const pagelimit = localStorage.getItem('dynamicPagination') || 5;
    console.log(pagelimit);
    const res = await axios.get(
      `http://localhost:3000/expense/getAllExpenses/1/${pagelimit}`,
      { headers: { Authorization: token } }
    );
    res.data.expenses.forEach((data) => {

      const id = data.id;
      let tr = document.createElement("tr");
      table.appendChild(tr);

      let idValue = document.createElement("th");
      idValue.setAttribute("style", "display: none");
      tr.appendChild(idValue);

      idValue.appendChild(document.createTextNode(id));
      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(data.category));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(data.amount));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(data.description));

      let td4 = document.createElement("td");

      let editBtn = document.createElement("button");
      editBtn.className = "edit btn btn-outline-success";
      editBtn.appendChild(document.createTextNode("Edit"));

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "delete btn btn-outline-danger";
      deleteBtn.appendChild(document.createTextNode("Delete"));
      td4.appendChild(editBtn);
      td4.appendChild(deleteBtn);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });
    const ul = document.getElementById("paginationUL");
    for (let i = 1; i <= res.data.totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      li.setAttribute("class", "page-item");
      a.setAttribute("class", "page-link");
      a.setAttribute("href", "#");
      a.appendChild(document.createTextNode(i));
      li.appendChild(a);
      ul.appendChild(li);
      a.addEventListener("click", paginationBtn);
    }
  } catch (err) {
    console.log(err);
  }
}
async function paginationBtn(e) {
  try {
    const PageNo = e.target.textContent;
    const token = localStorage.getItem("token");
    const pagelimit = localStorage.getItem('dynamicPagination') || 5;
    const res = await axios.get(
      `http://localhost:3000/expense/getAllExpenses/${PageNo}/${pagelimit}`,
      { headers: { Authorization: token } }
    );
    table.innerHTML = "";
    res.data.expenses.forEach((data) => {
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(data.category));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(data.amount));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(data.description));

      let td4 = document.createElement("td");

      let editBtn = document.createElement("button");
      editBtn.className = "edit btn btn-outline-success";
      editBtn.appendChild(document.createTextNode("Edit"));

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "delete btn btn-outline-danger";
      deleteBtn.appendChild(document.createTextNode("Delete"));
      td4.appendChild(editBtn);
      td4.appendChild(deleteBtn);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      table.appendChild(tr);
    });
  } catch (error) {
    console.log(error);
  }
}



async function deleteExpense(e) {
  try {
    const token = localStorage.getItem("token");
    if (e.target.classList.contains("delete")) {
      var tr = e.target.parentElement.parentElement;
      var id = tr.children[0].textContent;
      console.log(id);
      const deleteUser = await axios.get(
        `http://localhost:3000/expense/deleteExpense/${id}`,
        { headers: { Authorization: token } }
      );
      window.location.reload();
    }
  } catch (err) {
    console.log(err);
  }
}


async function editExpense(e) {
  try {
    const token = localStorage.getItem("token");
    if (e.target.classList.contains("edit")) {
      let tr = e.target.parentElement.parentElement;
      const id = tr.children[0].textContent;
      const amount = document.getElementById("amount");
      const description = document.getElementById("description");
      const category = document.getElementById("category");
      const addBtn = document.querySelector("#add-btn");
      // console.log(id);
      const res = await axios.get(
        `http://localhost:3000/expense/getAllExpenses`,
        { headers: { Authorization: token } }
      );
      res.data.forEach((data) => {
        if (data.id == id) {
          amount.value = data.amount;
          description.value = data.description;
          category.value = data.category;
          addBtn.textContent = "Update";
          addBtn.removeEventListener("click", addExpense);
          addBtn.addEventListener("click", async function update(e) {
            e.preventDefault();
            console.log("request to backend for edit");
            const res = await axios.post(
              `http://localhost:3000/expense/editExpense/${id}`,
              {
                category: category.value,
                description: description.value,
                amount: amount.value,
              },
              { headers: { Authorization: token } }
            );  

            addBtn.removeEventListener("click", update);
            addBtn.textContent = "Add Expense";
            window.location.reload();
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}
addBtn.addEventListener("click", addExpense);
downloadBtn.addEventListener('click', downloadFiles);
document.addEventListener("DOMContentLoaded", getAllExpenses);
rzpybtn.addEventListener("click", premiumMemberShip);
table.addEventListener("click", editExpense);
table.addEventListener("click", deleteExpense);
document.addEventListener("DOMContentLoaded", isPremiumUser);
