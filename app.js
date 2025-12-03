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

    // 날짜 자동 입력
    document.getElementById("date").value = new Date().toISOString().slice(0,10);

    // 입력 필드 초기화
    document.getElementById("amount").value = '';
    document.getElementById("place").value = '';
    document.getElementById("currency").value = 'KRW';

    // 편집 상태 초기화
    editingIndex = null;
}

function showList(filter='ALL') {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");
    loadList(filter);
}

// ===== 데이터 관리 =====
function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
}

function saveExpenses(data) {
    localStorage.setItem("expenses", JSON.stringify(data));
}

// ===== 저장 기능 =====
let editingIndex = null;

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

    if (editingIndex !== null) {
        // 수정
        expenses[editingIndex] = { amount: Number(amount), currency, date, place };
        editingIndex = null;
    } else {
        // 새 저장
        expenses.push({ amount: Number(amount), currency, date, place });
    }

    saveExpenses(expenses);
    alert("저장되었습니다!");
    goHome();
}

// ===== 홈 화면: 총 지출 표시 =====
function loadTotals() {
    const expenses = getExpenses();
    let totalKRW = 0;
    let totalJPY = 0;

    expenses.forEach(item => {
        if (item.currency === "KRW") totalKRW += item.amount;
        else totalJPY += item.amount;
    });

    document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
    document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
}

// ===== 내역 표시 =====
function loadList(filter='ALL') {
    const list = document.getElementById("expense-list");
    list.innerHTML = '';

    const expenses = getExpenses();

    expenses.forEach((item, index) => {
        if (filter !== 'ALL' && item.currency !== filter) return;

        const li = document.createElement('li');
        li.textContent = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place}`;

        // 수정 버튼
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.style.marginLeft = '10px';
        editBtn.style.fontSize = '0.8em';
        editBtn.onclick = () => editExpense(index);

        // 삭제 버튼
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.style.marginLeft = '5px';
        delBtn.style.fontSize = '0.8em';
        delBtn.onclick = () => deleteExpense(index);

        li.appendChild(editBtn);
        li.appendChild(delBtn);

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

    editingIndex = index;
    showAdd();
}

function deleteExpense(index) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const expenses = getExpenses();
    expenses.splice(index,1);
    saveExpenses(expenses);
    loadList();
    loadTotals();
}
