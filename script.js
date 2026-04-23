let currentUser = null;

// Page switching
function showRegister() {
    loginPage.classList.add("hidden");
    registerPage.classList.remove("hidden");
}

function showLogin() {
    registerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
}

// Register
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
    alert("Account created!");
    showLogin();
}

// Login
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

// Update UI
function updateUI() {
    balance.innerText = currentUser.balance;
    history.innerHTML = "";

    currentUser.history.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item;
        history.appendChild(li);
    });
}

// Save data
function save() {
    localStorage.setItem(currentUser.username, JSON.stringify(currentUser));
    updateUI();
}

// Deposit
function deposit() {
    let amt = parseInt(amount.value);

    if (amt > 0) {
        currentUser.balance += amt;
        currentUser.history.push("Deposited ₹" + amt);
        save();
    } else {
        alert("Invalid amount");
    }
}

// Withdraw
function withdraw() {
    let amt = parseInt(amount.value);

    if (amt > currentUser.balance) {
        alert("Insufficient balance");
        return;
    }

    if (amt > 0) {
        currentUser.balance -= amt;
        currentUser.history.push("Withdrew ₹" + amt);
        save();
    }
}

// Transfer
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

    currentUser.history.push("Transferred ₹" + amt + " to " + rec);
    receiverAcc.history.push("Received ₹" + amt + " from " + currentUser.username);

    localStorage.setItem(rec, JSON.stringify(receiverAcc));
    save();
}

// Loan
function loan() {
    let amt = parseInt(amount.value);

    if (amt > 50000) {
        alert("Loan limit exceeded (Max ₹50,000)");
        return;
    }

    if (amt > 0) {
        currentUser.balance += amt;
        currentUser.history.push("Loan credited ₹" + amt);
        save();
    }
}

// Logout
function logout() {
    location.reload();
}
