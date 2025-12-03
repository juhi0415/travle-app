if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker 등록 완료'))
      .catch(err => console.log('Service Worker 등록 실패', err));
  });
}

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

  loadList(currency);
}

function showDateFilter() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("add-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.add("hidden");
  document.getElementById("date-filter-screen").classList.remove("hidden");
}

function getExpenses() {
  return JSON.parse(localStorage.getItem("expenses") || "[]");
}
function saveExpenses(data) {
  localStorage.setItem("expenses", JSON.stringify(data));
}

function saveExpense() {
  const amount = document.getElementById("amount").value;
  const currency = document.getElementById("currency").value;
  const date = document.getElementById("date").value;
  const place = document.getElementById("place").value;

  if (!amount || !date || !place) { alert("모든 항목을 입력해주세요!"); return; }

  const expenses = getExpenses();
  expenses.push({ amount: Number(amount), currency, date, place });
  saveExpenses(expenses);
  alert("저장되었습니다!");
  goHome();
}

function loadTotals() {
  const expenses = getExpenses();
  let totalKRW = 0, totalJPY = 0;
  expenses.forEach(item => {
    if(item.currency==="KRW") totalKRW += item.amount;
    else totalJPY += item.amount;
  });
  document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
  document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
}

function loadList(filter) {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";
  const expenses = getExpenses();
  expenses.forEach((item, index) => {
    if(filter && item.currency !== filter) return;
    const li = document.createElement("li");
    li.innerHTML = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place} 
      <button onclick="editExpense(${index})" class="small-btn">✏️</button>
      <button onclick="deleteExpense(${index})" class="small-btn">🗑️</button>`;
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
  expenses.splice(index,1);
  saveExpenses(expenses);
  showAdd();
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

function viewByDate() {
  const date = document.getElementById("filter-date").value;
  if(!date) { alert("날짜를 선택하세요"); return; }
  const list = document.getElementById("expense-list");
  list.innerHTML = "";
  const expenses = getExpenses();
  expenses.forEach((item, index) => {
    if(item.date !== date) return;
    const li = document.createElement("li");
    li.innerHTML = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place} 
      <button onclick="editExpense(${index})" class="small-btn">✏️</button>
      <button onclick="deleteExpense(${index})" class="small-btn">🗑️</button>`;
    list.appendChild(li);
  });
  document.getElementById("date-filter-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.remove("hidden");
}

loadTotals();
