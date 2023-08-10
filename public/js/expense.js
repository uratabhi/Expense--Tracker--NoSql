var form = document.querySelector('#my-form');
var users = document.getElementById('users');

form.addEventListener('submit', addExpense);


async function addExpense(e){
     e.preventDefault();
     try {
       const token = localStorage.getItem('token');
       const amount =  e.target.amount.value;
       const description = e.target.description.value;
       const category  = e.target.category.value;
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

async function getAllExpenses(){
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:3000/expense/getAllExpenses",
        {headers : {Authorization : token}});
        res.data.forEach((data)=>{
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
    } catch (err) {
        console.log(err);
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