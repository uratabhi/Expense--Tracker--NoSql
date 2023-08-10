const signUp = document.getElementById('signUp');
const signIn = document.getElementById('signIn');
const container = document.getElementById('container');
const signUpBtn = document.getElementById('signUpBtn');
const loginBtn  = document.getElementById('loginBtn');
const loginEmail = document.getElementById('loginemail');
const loginPass = document.getElementById('loginpassword');

signUp.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signIn.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

loginBtn.addEventListener('click', login);

async function login(e){
		const loginDetails = {
			loginEmail : loginEmail.value,
			loginPass : loginPass.value
		}
		const res = await axios.post("http://localhost:3000/user/login", loginDetails);
		console.log(res.data);
		alert(res.data.message);
		window.location.href = "/expense";	 	

}