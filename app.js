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
  document.getElementById("date").value = new Date().toISOString().slice(0,10);
}

function showList(filter = 'ALL') {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("add-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.remove("hidden");
  loadList(filter);
}

// ===== 데이터 관리 (로컬Storage) =====
function getExpenses() {
  return JSON.parse(localStorage.getItem("expenses") || "[]");
}

function saveExpenses(data) {
  localStorage.setItem("expenses", JSON.stringify(data));
}

// ===== 저장 기능 =====
function saveExpense() {
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const date = document.getElementById("date").value;
  const place = document.getElementById("place").value;

  if (!amount || !date || !place) {
    return alert("모든 항목을 입력해주세요!");
  }

  const expenses = getExpenses();
  expenses.push({amount, currency, date, place});
  saveExpenses(expenses);
  alert("저장 완료!");
  goHome();
}

// ===== 총액 표시 =====
function loadTotals() {
  const expenses = getExpenses();
  let totalKRW = 0, totalJPY = 0;

  expenses.forEach(item => {
    if(item.currency === "KRW") totalKRW += item.amount;
    else totalJPY += item.amount;
  });

  document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW}원`;
  document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY}엔`;
}

// ===== 내역 표시 =====
function loadList(filter='ALL') {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  const expenses = getExpenses().filter(item => filter==='ALL' || item.currency===filter);

  expenses.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place}`;
    list.appendChild(li);
  });
}

// ===== 날짜별 조회 =====
function showListByDate() {
  const start = document.getElementById("start-date").value;
  const end = document.getElementById("end-date").value;

  if(!start || !end) return alert("시작 날짜와 끝 날짜를 모두 선택해주세요.");

  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("add-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.remove("hidden");

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  const expenses = getExpenses().filter(item => item.date >= start && item.date <= end);

  expenses.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place}`;
    list.appendChild(li);
  });
}

// ===== 초기 로드 =====
loadTotals();
