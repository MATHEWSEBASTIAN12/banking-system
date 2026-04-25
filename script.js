let currentUser = null;

/* PAGE SWITCH */
function showRegister() {
    loginPage.classList.add("hidden");
    registerPage.classList.remove("hidden");
}

function showLogin() {
    registerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
}

/* UPI SECTION */
function showUPI() {
    document.getElementById("upiSection").classList.toggle("hidden");
}

/* REGISTER */
function register() {
    let user = regUser.value.trim();
    let pass = regPass.value;

    if (!user || pass.length < 6) {
        alert("Enter valid details");
        return;
    }

    if (localStorage.getItem(user)) {
        alert("User already exists");
        return;
    }

    let account = {
        username: user,
        password: pass,
        balance: 1000,
        history: []
    };

    localStorage.setItem(user, JSON.stringify(account));
    alert("Account created");
    showLogin();
}

/* LOGIN */
function login() {
    let user = loginUser.value.trim();
    let pass = loginPass.value;

    let data = JSON.parse(localStorage.getItem(user));

    if (!data || data.password !== pass) {
        alert("Invalid login");
        return;
    }

    currentUser = data;

    loginPage.classList.add("hidden");
    dashboard.classList.remove("hidden");

    userDisplay.innerText = user;
    updateUI();
}

/* UPDATE UI */
function updateUI() {
    balance.innerText = currentUser.balance;
    history.innerHTML = "";

    currentUser.history.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item;
        history.appendChild(li);
    });

    updateSidebar();
}

/* SIDEBAR */
function updateSidebar() {
    sideName.innerText = "Name: " + currentUser.username;
    sideUser.innerText = "Username: " + currentUser.username;
    sideID.innerText = "Bank ID: FB" + Math.floor(Math.random() * 10000);
    sideBalance.innerText = currentUser.balance;
}

/* SAVE */
function save() {
    localStorage.setItem(currentUser.username, JSON.stringify(currentUser));
    updateUI();
}

/* BANK ACTIONS */
function deposit() {
    let amt = parseInt(amount.value);

    if (isNaN(amt) || amt <= 0) {
        alert("Enter valid amount");
        return;
    }

    currentUser.balance += amt;
    currentUser.history.push("Deposited ₹" + amt);
    save();
}

function withdraw() {
    let amt = parseInt(amount.value);

    if (isNaN(amt) || amt <= 0) {
        alert("Enter valid amount");
        return;
    }

    if (amt > currentUser.balance) {
        alert("Insufficient balance");
        return;
    }

    currentUser.balance -= amt;
    currentUser.history.push("Withdrew ₹" + amt);
    save();
}

function transfer() {
    let amt = parseInt(amount.value);
    let rec = receiver.value.trim();

    if (isNaN(amt) || amt <= 0 || !rec) {
        alert("Enter valid details");
        return;
    }

    let receiverAcc = JSON.parse(localStorage.getItem(rec));

    if (!receiverAcc) {
        alert("Receiver not found");
        return;
    }

    if (amt > currentUser.balance) {
        alert("Insufficient balance");
        return;
    }

    currentUser.balance -= amt;
    receiverAcc.balance += amt;

    currentUser.history.push("Sent ₹" + amt + " to " + rec);
    receiverAcc.history.push("Received ₹" + amt + " from " + currentUser.username);

    localStorage.setItem(rec, JSON.stringify(receiverAcc));
    save();
}

/* LOAN PAGE (UPDATED) */
function openLoanPage() {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("loanPage").classList.remove("hidden");

    document.getElementById("loanUser").value = currentUser.username;
}

/* PROCESS LOAN (UPDATED FIX) */
function processLoan() {

    let user = document.getElementById("loanUser").value.trim();
    let pass = document.getElementById("loanPass").value.trim();
    let amt = parseInt(document.getElementById("loanAmount").value);

    if (!user || !pass || isNaN(amt)) {
        alert("Fill all fields correctly");
        return;
    }

    if (user !== currentUser.username || pass !== currentUser.password) {
        alert("Invalid credentials");
        return;
    }

    if (amt < 4999) {
        alert("Minimum loan amount is ₹4999");
        return;
    }

    let interest = 0.07;
    let time = amt <= 100000 ? 12 : 16;
    let total = Math.round(amt + (amt * interest));

    // CREDIT MONEY
    currentUser.balance += amt;

    currentUser.history.push(`Loan ₹${amt} | 7% | ${time} months`);

    // SAVE + UPDATE
    localStorage.setItem(currentUser.username, JSON.stringify(currentUser));
    updateUI();

    // SHOW ALERT
    alert("Loan granted! Repay ₹" + total + " within " + time + " months.");

    // SWITCH PAGE
    document.getElementById("loanPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    // CLEAR FIELDS
    document.getElementById("loanPass").value = "";
    document.getElementById("loanAmount").value = "";
    document.getElementById("collateral").value = "";
}

    // RETURN TO DASHBOARD
    document.getElementById("loanPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
}

/* CHEQUE */
function downloadCheque() {
    let html = `
    <html><body style="border:2px solid black;padding:20px;width:600px;font-family:Arial">
    <h2>FEDERAL BANK</h2>
    <p>Pay: ______________________</p>
    <p>Amount: ___________________</p>
    <p>Name: ${currentUser.username}</p>
    <p>Balance: ₹${currentUser.balance}</p>
    <div style="border:2px solid green;border-radius:50%;width:100px;height:100px;text-align:center;padding-top:30px;color:green">
    FEDERAL BANK
    </div>
    <p>Signature: ______________</p>
    </body></html>
    `;

    let blob = new Blob([html], {type:"text/html"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cheque.html";
    a.click();
}

/* LOGOUT */
function logout() {
    location.reload();
}
document.addEventListener("DOMContentLoaded", function () {
    let btn = document.getElementById("loanBtn");

    if (btn) {
        btn.addEventListener("click", function (event) {
            event.preventDefault(); // 🔥 stops page refresh
            processLoan();
        });
    }
});
