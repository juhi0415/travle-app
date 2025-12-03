// ===== 서비스 워커 등록 =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('ServiceWorker 등록 완료'))
            .catch(err => console.log('ServiceWorker 등록 실패', err));
    });
}

// ===== 화면 전환 =====
function goHome() {
    document.getElementById("home-screen").classList.remove("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    loadTotals();
}

function showAdd() {
    document.getElementById("add-screen").classList.remove("hidden");
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    clearForm();
}

function showList(filter = 'ALL') {
    document.getElementById("list-screen").classList.remove("hidden");
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    loadList(filter);
}

function showDateFilter() {
    document.getElementById("date-filter-screen").classList.remove("hidden");
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
}

// ===== 데이터 관리 =====
function getExpenses() {
    const data = localStorage.getItem("expenses");
    return data ? JSON.parse(data) : [];
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
    clearForm();
    goHome();
}

// ===== 폼 초기화 =====
function clearForm() {
    document.getElementById("amount").value = '';
    document.getElementById("currency").value = 'KRW';
    document.getElementById("date").value = new Date().toISOString().slice(0,10);
    document.getElementById("place").value = '';
}

// ===== 홈 화면 총액 =====
function loadTotals() {
    const expenses = getExpenses();
    let totalKRW = 0, totalJPY = 0;
    expenses.forEach(e => e.currency === 'KRW' ? totalKRW += e.amount : totalJPY += e.amount);
    document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
    document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
}

// ===== 내역 표시 =====
function loadList(filter='ALL') {
    const list = document.getElementById("expense-list");
    list.innerHTML = '';
    const expenses = getExpenses();
    let filtered = expenses;
    if (filter==='KRW') filtered = expenses.filter(e=>e.currency==='KRW');
    else if (filter==='JPY') filtered = expenses.filter(e=>e.currency==='JPY');

    filtered.forEach((item,index)=>{
        const li = document.createElement("li");
        li.innerHTML = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place} 
        <button onclick="editExpense(${index})">✏️</button> 
        <button onclick="deleteExpense(${index})">🗑️</button>`;
        list.appendChild(li);
    });
}

// ===== 편집/삭제 =====
function editExpense(idx) {
    const expenses = getExpenses();
    const e = expenses[idx];
    document.getElementById("amount").value = e.amount;
    document.getElementById("currency").value = e.currency;
    document.getElementById("date").value = e.date;
    document.getElementById("place").value = e.place;

    expenses.splice(idx,1);
    saveExpenses(expenses);
    showAdd();
}

function deleteExpense(idx) {
    if(!confirm("정말 삭제하시겠습니까?")) return;
    const expenses = getExpenses();
    expenses.splice(idx,1);
    saveExpenses(expenses);
    loadList();
}

// ===== 날짜별 보기 =====
function viewByDate() {
    const selectedDate = document.getElementById("filter-date").value;
    if(!selectedDate) return alert("날짜를 선택하세요!");
    const list = document.getElementById("expense-list");
    list.innerHTML = '';
    const expenses = getExpenses().filter(e => e.date === selectedDate);
    expenses.forEach((item,index)=>{
        const li = document.createElement("li");
        li.innerHTML = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place} 
        <button onclick="editExpense(${index})">✏️</button> 
        <button onclick="deleteExpense(${index})">🗑️</button>`;
        list.appendChild(li);
    });
}
