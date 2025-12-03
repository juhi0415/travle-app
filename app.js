// ===== 화면 전환 =====
function goHome() {
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("home-screen").classList.remove("hidden");
    loadTotals();
}

function showAdd() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.remove("hidden");

    // 날짜 자동 입력
    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
    document.getElementById("amount").value = "";
    document.getElementById("place").value = "";
}

function showList(filter = "ALL") {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");

    loadList(filter);
}

function showDateFilter() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.remove("hidden");
}

// ===== 데이터 관리 =====
function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
}

function saveExpenses(data) {
    localStorage.setItem("expenses", JSON.stringify(data));
}

// ===== 저장 기능 =====
function saveExpense() {
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if (!amount || !date || !place) {
        alert("모든 항목을 입력해주세요!");
        return;
    }

    const expenses = getExpenses();
    expenses.push({ amount: Number(amount), currency, date, place });
    saveExpenses(expenses);
    alert("저장되었습니다!");
    goHome();
}

// ===== 홈 화면: 총 지출 표시 =====
function loadTotals() {
    const expenses = getExpenses();
    let totalKRW = 0, totalJPY = 0;
    expenses.forEach(item => {
        if (item.currency === "KRW") totalKRW += item.amount;
        else totalJPY += item.amount;
    });
    document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
    document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
}

// ===== 내역 표시 =====
function loadList(filter) {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";
    let expenses = getExpenses();
    if (filter === "KRW") expenses = expenses.filter(e => e.currency === "KRW");
    if (filter === "JPY") expenses = expenses.filter(e => e.currency === "JPY");

    expenses.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place} `;

        // 수정 버튼
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.style.width = "30px";
        editBtn.style.marginLeft = "5px";
        editBtn.onclick = () => editExpense(index);
        li.appendChild(editBtn);

        // 삭제 버튼
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.style.width = "30px";
        delBtn.style.marginLeft = "5px";
        delBtn.oncli
