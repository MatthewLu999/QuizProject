// login function 
function login(){
    let username = document.getElementById("useremail")
    let userpassword = document.getElementById("userpassword")
    username.classList.remove("is-invalid")
    userpassword.classList.remove("is-invalid")
    if(username.value.length >0 && userpassword.value.length >0){
        var checkresult = check_email(username.value)
        if(checkresult){
        username.classList.add("is-valid")
        userpassword.classList.add("is-valid")
        if(username.value === "admin@gmail.com" && userpassword.value === "admin"){
            setCookieforArray("username", username.value, 365);
            window.location.href = "index.html"
        }else{
            username.classList.add("is-valid")
            userpassword.classList.add("is-invalid")
        }
        }else{
        username.classList.add("is-invalid")
        }
    }else{
  username.classList.add("is-invalid")
  userpassword.classList.add("is-invalid")
    }
}

//check user email is valid or not
function check_email(useremail){
    return useremail.includes('@');
}