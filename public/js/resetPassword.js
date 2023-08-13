
const rpBtn = document.getElementById("resetPasswordBtn");

rpBtn.addEventListener('click', updatePassword);



async function updatePassword(){
    try {
        const newPassword  = document.getElementById('newPassword').value;
      //  console.log(newPassword);
        const res = await axios.post(
            "http://localhost:3000/password/resetPassword",
            {
              password: newPassword,
            }
          );
          alert(res.data.message);
          window.location.href = "/";
    } catch (error) {
        console.log(error);
    }
}