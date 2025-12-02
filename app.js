// ===== 서비스 워커 등록 =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/travle-app/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
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

  // 날짜 자동 입력
  document.getElementById("date").value = new Date().toISOString().slice(0, 10);
}

function showList() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("add-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.remove("hidden");

  loadList();
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

  expenses.push({
    amount: Number(amount),
    currency,
    date,
    place
  });

  saveExpenses(expenses);
  alert("저장 완료!");
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

  document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW}원`;
  document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY}엔`;
}

loadTotals();

// ===== 내역 표시 =====
function loadList() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  const expenses = getExpenses();

  expenses.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place}`;
    list.appendChild(li);
  });
}

