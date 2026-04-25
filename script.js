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

/* REGISTER */
function register() {
    let user = regUser.value.trim();
    let pass = regPass.value;

    if (!user || pass.length < 6) {
        alert("Enter valid username & password (min 6 chars)");
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
    alert("Account created successfully");
    showLogin();
}

/* LOGIN */
function login() {
    let user = loginUser.value.trim();
    let pass = loginPass.value;

    let data = JSON.parse(localStorage.getItem(user));

    if (!data || data.password !== pass) {
        alert("Invalid login credentials");
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

/* SIDEBAR UPDATE */
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

/* LOAN PAGE */
function openLoanPage() {
    dashboard.classList.add("hidden");
    loanPage.classList.remove("hidden");

    loanUser.value = currentUser.username;
}

/* FIXED LOAN FUNCTION */
function processLoan() {
    let user = loanUser.value.trim();
    let pass = loanPass.value.trim();
    let amt = parseInt(loanAmount.value);

    // VALIDATION
    if (!user || !pass || isNaN(amt)) {
        alert("Please fill all fields correctly");
        return;
    }

    if (user !== currentUser.username || pass !== currentUser.password) {
        alert("Invalid credentials");
        return;
    }

    if (amt < 100000) {
        alert("Minimum loan amount is ₹100000");
        return;
    }

    // LOAN RULES
    let interestRate = 0.07;
    let time = (amt === 100000) ? 12 : 16;

    let total = Math.round(amt + (amt * interestRate));

    // CREDIT MONEY
    currentUser.balance += amt;

    // SAVE HISTORY
    currentUser.history.push(
        `Loan ₹${amt} | Interest 7% | ${time} months`
    );

    // SAVE DATA
    localStorage.setItem(currentUser.username, JSON.stringify(currentUser));

    // UPDATE UI
    updateUI();

    // SUCCESS ALERT
    alert("Your loan request granted. Kindly repay ₹" + total + " within " + time + " months.");

    // CLEAR FIELDS
    loanPass.value = "";
    loanAmount.value = "";
    collateral.value = "";

    // GO BACK TO DASHBOARD
    loanPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
}

/* CHEQUE DOWNLOAD */
function downloadCheque() {
    let html = `
    <html>
    <body style="border:2px solid black;padding:20px;width:600px;font-family:Arial">
        <h2>FEDERAL BANK</h2>
        <p>Date: __________</p>
        <p>Pay: __________________________</p>
        <p>Amount: _______________________</p>
        <br>
        <p>Name: ${currentUser.username}</p>
        <p>Balance: ₹${currentUser.balance}</p>
        <br><br>
        <div style="border:2px solid green;border-radius:50%;width:100px;height:100px;text-align:center;padding-top:30px;color:green">
            FEDERAL BANK
        </div>
        <br>
        <p>Signature: __________________</p>
    </body>
    </html>
    `;

    let blob = new Blob([html], { type: "text/html" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cheque.html";
    a.click();
}

/* LOGOUT */
function logout() {
    location.reload();
}
