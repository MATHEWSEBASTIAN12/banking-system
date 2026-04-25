let currentUser = null;

/* PAGE SWITCH */
function showRegister() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("registerPage").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}

/* UPI */
function showUPI() {
    document.getElementById("upiSection").classList.toggle("hidden");
}

/* REGISTER */
function register() {
    let user = document.getElementById("regUser").value.trim();
    let pass = document.getElementById("regPass").value;

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
    let user = document.getElementById("loginUser").value.trim();
    let pass = document.getElementById("loginPass").value;

    let data = JSON.parse(localStorage.getItem(user));

    if (!data || data.password !== pass) {
        alert("Invalid login");
        return;
    }

    currentUser = data;

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("userDisplay").innerText = user;

    updateUI();
}

/* UPDATE UI */
function updateUI() {
    document.getElementById("balance").innerText = currentUser.balance;

    let historyList = document.getElementById("history");
    historyList.innerHTML = "";

    currentUser.history.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item;
        historyList.appendChild(li);
    });

    updateSidebar();
}

/* SIDEBAR */
function updateSidebar() {
    document.getElementById("sideName").innerText = "Name: " + currentUser.username;
    document.getElementById("sideUser").innerText = "Username: " + currentUser.username;
    document.getElementById("sideID").innerText = "Bank ID: FB" + Math.floor(Math.random()*10000);
    document.getElementById("sideBalance").innerText = currentUser.balance;
}

/* SAVE */
function save() {
    localStorage.setItem(currentUser.username, JSON.stringify(currentUser));
    updateUI();
}

/* BANK FUNCTIONS */
function deposit() {
    let amt = parseInt(document.getElementById("amount").value);

    if (isNaN(amt) || amt <= 0) {
        alert("Enter valid amount");
        return;
    }

    currentUser.balance += amt;
    currentUser.history.push("Deposited ₹" + amt);
    save();
}

function withdraw() {
    let amt = parseInt(document.getElementById("amount").value);

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
    let amt = parseInt(document.getElementById("amount").value);
    let rec = document.getElementById("receiver").value.trim();

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

/* OPEN LOAN PAGE */
function openLoanPage() {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("loanPage").classList.remove("hidden");

    document.getElementById("loanUser").value = currentUser.username;
}

/* FINAL WORKING LOAN FUNCTION */
function processLoan() {
alert("ProcessLoan triggered");
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

    currentUser.history.push("Loan ₹" + amt);

    save(); // 🔥 CRITICAL FIX

    alert("Loan granted! Repay ₹" + total + " in " + time + " months.");

    // SWITCH BACK
    document.getElementById("loanPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    // CLEAR INPUTS
    document.getElementById("loanPass").value = "";
    document.getElementById("loanAmount").value = "";
    document.getElementById("collateral").value = "";
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
function backToDashboard() {
    document.getElementById("loanPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
}
function deleteAccount() {
    let confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (!confirmDelete) return;

    // Remove from storage
    localStorage.removeItem(currentUser.username);

    alert("Your account has been deleted.");

    // Go back to login page
    location.reload();
}
document.addEventListener("DOMContentLoaded", function () {
    let btn = document.getElementById("deleteBtn");

    if (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            deleteAccount();
        });
    }
});
