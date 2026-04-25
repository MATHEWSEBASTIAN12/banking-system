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
    let user = regUser.value;
    let pass = regPass.value;

    if (!user || pass.length < 6) {
        alert("Invalid details");
        return;
    }

    if (localStorage.getItem(user)) {
        alert("User exists");
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
    let user = loginUser.value;
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

/* UI UPDATE */
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

function updateSidebar() {
    sideName.innerText = "Name: " + currentUser.username;
    sideUser.innerText = "Username: " + currentUser.username;
    sideID.innerText = "Bank ID: FB" + Math.floor(Math.random()*10000);
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
    if (amt > 0) {
        currentUser.balance += amt;
        currentUser.history.push("Deposited ₹" + amt);
        save();
    }
}

function withdraw() {
    let amt = parseInt(amount.value);
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
    let rec = receiver.value;

    let receiverAcc = JSON.parse(localStorage.getItem(rec));
    if (!receiverAcc) {
        alert("User not found");
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

function processLoan() {
    let user = loanUser.value;
    let pass = loanPass.value;
    let amt = parseInt(loanAmount.value);

    if (user !== currentUser.username || pass !== currentUser.password) {
        alert("Invalid credentials");
        return;
    }

    let interest = 0.07;
    let time = amt >= 100000 ? 16 : 12;

    let total = amt + (amt * interest);

    currentUser.balance += amt;
    currentUser.history.push(`Loan ₹${amt} | 7% | ${time} months`);

    save();

    alert("Loan granted! Repay ₹" + total + " in " + time + " months");

    loanPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
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
