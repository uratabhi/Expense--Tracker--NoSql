var form = document.querySelector('#my-form');
var users = document.getElementById('users');

async function getAllExpenses(){
    try {
        const res = await axios.get("http://localhost:3000/expense/getAllExpenses");
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
        if(e.target.classList.contains("delete")){
            var parentNode = e.target.parentElement;
            let id = parentNode.getAttribute('id');
            console.log(id);
            const deleteUser = await axios.get(`http://localhost:3000/expense/deleteExpense/${id}`);
            window.location.reload();
        }
     } catch (err) {
        console.log(err);
     }
}
users.addEventListener('click', editExpense);
async function editExpense(e){
      try {
         if(e.target.classList.contains("edit")){
            let parentNode = e.target.parentElement;
            const  id = parentNode.getAttribute('id');
            const amount = document.getElementById('amount');
            const description = document.getElementById('description');
            const category = document.getElementById('choice');
            const myBtn = document.querySelector('.btn');
           // console.log(id);
            const res = await axios.get(`http://localhost:3000/expense/getAllExpenses`);
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
                          }
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