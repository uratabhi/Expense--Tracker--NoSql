
var users = document.getElementById('users');
var form = document.getElementById('my-form');
var rzpybtn = document.getElementById('rzpy-btn');
var btn = document.querySelector('.btn');
var downloadBtn = document.getElementById('reports');
var show = document.getElementById('show');










form.addEventListener('submit', addExpense);




// download button stuffs 
downloadBtn.addEventListener('click', downloadFiles);


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

async function addExpense(e){
     e.preventDefault();
     try {
       const token = localStorage.getItem('token');
       const amount =  document.getElementById('amount').value;
       const description = document.getElementById('description').value;
       const category  = document.getElementById('choice').value;
       const res = await axios.post("http://localhost:3000/expense/addExpense", {
         amount,
         description,
         category,
       }, {headers : {Authorization : token}})
       if(res.status==200){
         window.location.reload();
       }
     } catch (error) {
        console.log(error);
     }
}

show.addEventListener('click', showfiledownloaded);

async function showfiledownloaded(e){
       e.preventDefault();
       try {
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:3000/premium/showfiledownloaded", {
          headers: { Authorization: token },
        });
        var ptr = 1;
    
        res.data.data.forEach((data)=>{
          const parentNode = document.getElementById('downloads');
          const childNode = document.createElement('li');
          var text = `(${ptr++}) fileurl - ${data.fileurl} - createdAt ${data.createdAt}`
          childNode.appendChild(document.createTextNode(text));
          parentNode.appendChild(childNode);
        })
        
       } catch (error) {
         console.log(error);
       }
}


rzpybtn.addEventListener('click', premiumMemberShip);

async function premiumMemberShip(e){
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3000/purchase/premiumMembership",
    {headers : {Authorization : token}})  
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
  }
  const parentNode = document.querySelector('#leader');
  const childNode = document.createElement('button');
  childNode.appendChild(document.createTextNode('LearderBoard'));
  parentNode.appendChild(childNode);
  childNode.addEventListener('click', showLeaderBoard);
}
async function showLeaderBoard(e){
   const token = localStorage.getItem('token');
   const res = await axios.get("http://localhost:3000/premium/showLeaderBoard", 
   {headers : { Authorization: token}});
   res.data.forEach((data)=>{
    const parentNode = document.getElementById('leaderboard');
    const childNode = document.createElement('li');
    let del = document.createElement('button');
    let edit = document.createElement('button');
    var textToBePut = `Name - ${data.Name} Total Expense - ${data.totalExpenses}`;
     childNode.appendChild(document.createTextNode(textToBePut));
     childNode.appendChild(edit);
     childNode.appendChild(del);
     parentNode.appendChild(childNode);
   })
}

document.addEventListener("DOMContentLoaded", isPremiumUser);
async function getAllExpenses(e){
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:3000/expense/getAllExpenses/1",
        {headers : {Authorization : token}});
        res.data.expenses.forEach((data)=>{
            const parentNode = document.getElementById('users');
            const childNode = document.createElement('li');
            childNode.setAttribute("id", data.id);
            let del = document.createElement('button');
            let edit = document.createElement('button');
            del.className = 'delete';
            edit.className = 'edit';
            del.appendChild(document.createTextNode('delete'));
            edit.appendChild(document.createTextNode('edit'));
            var textToBePut = `${data.amount} - ${data.description} - ${data.category}`;
             childNode.appendChild(document.createTextNode(textToBePut));
             childNode.appendChild(edit);
             childNode.appendChild(del);
             parentNode.appendChild(childNode);
        })
        const ul = document.getElementById('pagination');
        for (let i = 1; i <= res.data.totalPages; i++) {
          const li = document.createElement("li");
          const a = document.createElement("a");
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

async function paginationBtn(e){
   try {
      const PageNo = e.target.textContent;
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/expense/getAllExpenses/${PageNo}`,
      {headers : {Authorization : token}});
      users.innerHTML = "";
      res.data.expenses.forEach((data)=>{
        const parentNode = document.getElementById('users');
        const childNode = document.createElement('li');
        childNode.setAttribute("id", data.id);
        let del = document.createElement('button');
        let edit = document.createElement('button');
        del.className = 'delete';
        edit.className = 'edit';
        del.appendChild(document.createTextNode('delete'));
        edit.appendChild(document.createTextNode('edit'));
        var textToBePut = `${data.amount} - ${data.description} - ${data.category}`;
         childNode.appendChild(document.createTextNode(textToBePut));
         childNode.appendChild(edit);
         childNode.appendChild(del);
         parentNode.appendChild(childNode);
    })
   } catch (error) {
     console.log(error);
   }
}



users.addEventListener("click", deleteExpense);
async function deleteExpense(e){
     try {
        const token = localStorage.getItem('token');
        if(e.target.classList.contains("delete")){
            var parentNode = e.target.parentElement;
            let id = parentNode.getAttribute('id');
            console.log(id);
            const deleteUser = await axios.get(`http://localhost:3000/expense/deleteExpense/${id}`,
            {headers : {Authorization : token}});
            window.location.reload();
        }
     } catch (err) {
        console.log(err);
     }
}
users.addEventListener('click', editExpense);
async function editExpense(e){
      try {
         const token = localStorage.getItem('token');
         if(e.target.classList.contains("edit")){
            let parentNode = e.target.parentElement;
            const  id = parentNode.getAttribute('id');
            const amount = document.getElementById('amount');
            const description = document.getElementById('description');
            const category = document.getElementById('choice');
            const myBtn = document.querySelector('.btn');
           // console.log(id);
            const res = await axios.get(`http://localhost:3000/expense/getAllExpenses`, 
            {headers : {Authorization : token}});
            res.data.forEach((data)=>{
                 if(data.id==id){
                    amount.value = data.amount;
                    description.value = data.description;
                    category.value = data.category;
                    myBtn.textContent = "Update";
                    myBtn.addEventListener('click', async function update(e){
                        e.preventDefault();
                        console.log("request to backend for edit");
                        const res = await axios.post(
                          `http://localhost:3000/expense/editExpense/${id}`,
                          {
                            category: category.value,
                            description: description.value,
                            amount: amount.value,
                          },
                          {headers : {Authorization : token}}
                        );
            
                        myBtn.removeEventListener("click", update);
                        myBtn.textContent = "Add Expense";
                        window.location.reload();
                    });
                 }
            })
         }
      } catch (err) {
         console.log(err);
      }
}
document.addEventListener("DOMContentLoaded", getAllExpenses);