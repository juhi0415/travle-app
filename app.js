// ===== 서비스 워커 등록 =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/travle-app/service-worker.js')
            .then(reg => console.log('ServiceWorker 등록 완료:', reg))
            .catch(err => console.log('ServiceWorker 등록 실패:', err));
    });
}

// ===== 화면 전환 =====
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

    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
}

function showList(currencyFilter = "ALL") {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");

    loadList(currencyFilter);
}

// ===== 데이터 관리 =====
function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
}

function saveExpenses(data) {
    localStorage.setItem("expenses", JSON.stringify(data));
}

// ===== 저장 / 수정 기능 =====
let editIndex = null; // 수정 중 인덱스

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

    if (editIndex !== null) {
        expenses[editIndex] = {
            amount: Number(amount),
            currency,
            date,
            place
        };
        alert("수정 완료!");
        editIndex = null;
    } else {
        expenses.push({ amount: Number(amount), currency, date, place });
        alert("저장 완료!");
    }

    saveExpenses(expenses);
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

    document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW}원`;
    document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY}엔`;
}

loadTotals();

// ===== 내역 표시 & 수정 =====
function loadList(currencyFilter = "ALL") {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";
    const expenses = getExpenses();

    expenses.forEach((item, index) => {
        if (currencyFilter !== "ALL" && item.currency !== currencyFilter) return;

        const li = document.createElement("li");
        li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place} `;

        const editBtn = document.createElement("button");
        editBtn.textContent = "수정";
        editBtn.addEventListener("click", () => editExpense(index));
        li.appendChild(editBtn);

        list.appendChild(li);
    });
}

function editExpense(index) {
    const expenses = getExpenses();
    const item = expenses[index];

    document.getElementById("amount").value = item.amount;
    document.getElementById("currency").value = item.currency;
    document.getElementById("date").value = item.date;
    document.getElementById("place").value = item.place;

    editIndex = index; // 수정 상태 표시
    showAdd();
}
