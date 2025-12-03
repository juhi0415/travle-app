// 화면 전환
function goHome() {
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("home-screen").classList.remove("hidden");
    loadTotals();
}

function showAdd() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.remove("hidden");

    // 입력 초기화
    document.getElementById("amount").value = '';
    document.getElementById("currency").value = 'KRW';
    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
    document.getElementById("place").value = '';
}

function showList(filter) {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");
    loadList(filter);
}

// 데이터 관리
function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
}

function saveExpenses(data) {
    localStorage.setItem("expenses", JSON.stringify(data));
}

// 저장 기능
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

// 총액 표시
function loadTotals() {
    const expenses = getExpenses();
    let totalKRW = 0, totalJPY = 0;
    expenses.forEach(item => {
        if(item.currency === "KRW") totalKRW += item.amount;
        else totalJPY += item.amount;
    });
    document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
    document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
}

// 내역 표시
function loadList(filter="ALL") {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";
    const expenses = getExpenses();

    expenses.forEach((item, index) => {
        if(filter !== "ALL" && item.currency !== filter) return;
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place} 
            <button class="edit-btn" onclick="editExpense(${index})">✏️</button>
            <button class="delete-btn" onclick="deleteExpense(${index})">🗑️</button>
        `;
        list.appendChild(li);
    });
}

// 수정/삭제
function editExpense(index) {
    const expenses = getExpenses();
    const item = expenses[index];

    showAdd();
    document.getElementById("amount").value = item.amount;
    document.getElementById("currency").value = item.currency;
    document.getElementById("date").value = item.date;
    document.getElementById("place").value = item.place;

    // 기존 항목 삭제 후 다시 저장
    expenses.splice(index,1);
    saveExpenses(expenses);
}

function deleteExpense(index) {
    const expenses = getExpenses();
    if(confirm("정말 삭제하시겠습니까?")) {
        expenses.splice(index,1);
        saveExpenses(expenses);
        loadList();
        loadTotals();
    }
}

loadTotals();
