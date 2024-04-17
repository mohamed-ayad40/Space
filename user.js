const goRegister = document.querySelector(".register-link a");
const goLogin = document.querySelector(".loginP a");
const form = document.querySelector("form");
const alert = document.querySelector(".alert");
let baseURL = "https://tarmeezacademy.com/api/v1";
const closeBtn = document.querySelector(".close-btn");
const alertMsg = document.querySelector(".alert .msg");
let signBox = document.querySelector(".sign-box");
let url;
console.log(window.location.pathname)


closeBtn.onclick = () => {
    alert.classList.add("hide");
    alert.classList.remove( "show");
    setTimeout(() => {
        alert.classList.remove("danger-alert", "warning-alert", "success-alert");
        // console.log(alert.classList)
    }, 5000);
};


if(window.location.pathname === "/Space/login.html") {
    goRegister.onclick = () => {
        window.location = "register.html";
    };

} else if(window.location.pathname === "/Space/register.html") {
    goLogin.onclick = () => {
        window.location = "login.html";
    };
}

form.onsubmit = async (e) => {
    e.preventDefault()
    toggleLoader(true);
    const formData = new FormData(form);
    formData.append("username", document.getElementById("username").value);
    formData.append("password", document.getElementById("password").value);
    if(window.location.pathname === "/Space/login.html") {
        url = `${baseURL}/login`;
    } else {
        url = `${baseURL}/register`;
        formData.append("email", document.getElementById("email").value);
        formData.append("name", document.getElementById("name").value);
        formData.append("image", document.getElementById("image").files[0]);
    }
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: formData
        });
        let user = await response.json();

        if (user.errors) {
            throw new Error(user.message);
        }
        window.localStorage.setItem("token", user.token);
        window.localStorage.setItem("user", JSON.stringify(user.user));
        window.location = "index.html";
    } catch (err) {
        alertMsg.textContent  = err.message;
        alert.classList.add("danger-alert", "show", "showAlert");
        alert.classList.remove("hide");
        setTimeout(() => {
            closeBtn.click();
        }, 5000);
    };
    toggleLoader(false);
};


function toggleLoader(show = true) {
    if (show) {
      document.querySelector(".loader").style.display = "block";
    } else {
      document.querySelector(".loader").style.display = "none";
    }
};