// ===== 화면 전환 =====
function goHome() {
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("home-screen").classList.remove("hidden");
    loadTotals();
}

// ===== 화면 보기 =====
function showAdd() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.remove("hidden");

    document.getElementById("amount").value = "";
    document.getElementById("currency").value = "KRW";
    document.getElementById("date").value = new Date().toISOString().slice(0,10);
    document.getElementById("place").value = "";
}

function showList(currency) {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");

    const list = document.getElementById("expense-list");
    list.innerHTML = "";

    const expenses = getExpenses();
    const filtered = currency === 'ALL' ? expenses : expenses.filter(e => e.currency === currency);

    filtered.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.date} | ${item.currency} ${formatNumber(item.amount)} | ${item.place}
            <button onclick="editExpense(${index})">✏️</button>
            <button onclick="deleteExpense(${index})">🗑️</button>
        `;
        list.appendChild(li);
    });
}

function showDateFilter() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.remove("hidden");
}

// ===== localStorage 관리 =====
function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
}

function saveExpenses(data) {
    localStorage.setItem("expenses", JSON.stringify(data));
}

// ===== 저장 / 수정 / 삭제 =====
function saveExpense() {
    const amount = Number(document.getElementById("amount").value);
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if(!amount || !date || !place) {
        alert("모든 항목을 입력해주세요!");
        return;
    }

    let expenses = getExpenses();

    if(window.editIndex != null){
        expenses[window.editIndex] = { amount, currency, date, place };
        window.editIndex = null;
    } else {
        expenses.push({ amount, currency, date, place });
    }

    saveExpenses(expenses
