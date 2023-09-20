const logoutBtn = document.getElementById('logoutbtn');
const show = document.querySelector('#show');
const tbody = document.querySelector('#tbodyId');

show.addEventListener('click', showfiledownloaded);

async function showfiledownloaded(e) {
  e.preventDefault();
  console.log('hi i am in');
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

        let tr = document.createElement("tr");
        tbody.appendChild(tr);
    
        let td1 = document.createElement('td');
        td1.appendChild(document.createTextNode(ptr++));
    
        let td2 = document.createElement("td");
        let a = document.createElement("a");
        a.setAttribute("href", data.fileurl);
        a.appendChild(document.createTextNode('click here to download file'));
        td2.appendChild(a);
    
    
         tr.appendChild(td1);
         tr.appendChild(td2);
    });
  } catch (error) {
    console.log(error);
  }
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