// Firebase 모듈 import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyC39VtjT_othwi_WIS_S4cdOH2CKnDyrZY",
  authDomain: "travle-app-9c1ee.firebaseapp.com",
  projectId: "travle-app-9c1ee",
  storageBucket: "travle-app-9c1ee.firebasestorage.app",
  messagingSenderId: "469444862658",
  appId: "1:469444862658:web:8cd5b52dd0f78e0c93915b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const expensesCol = collection(db, "expenses");

// ===== 화면 전환 =====
function goHome() {
  document.getElementById("home-screen").classList.remove("hidden");
  document.getElementById("add-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.add("hidden");
  loadTotals();
}

function showAdd() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.add("hidden");
  document.getElementById("add-screen").classList.remove("hidden");

  document.getElementById("date").value = new Date().toISOString().slice(0, 10);
}

function showList(filter='ALL') {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("add-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.remove("hidden");

  loadList(filter);
}

// ===== 지출 저장 =====
async function saveExpense() {
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const date = document.getElementById("date").value;
  const place = document.getElementById("place").value;

  if(!amount || !date || !place) {
    alert("모든 항목을 입력해주세요!");
    return;
  }

  await addDoc(expensesCol, { amount, currency, date, place });
  alert("저장 완료!");
  goHome();
}

// ===== 총액 표시 =====
async function loadTotals() {
  const snapshot = await getDocs(expensesCol);
  let totalKRW = 0, totalJPY = 0;
  snapshot.forEach(doc => {
    const item = doc.data();
    if(item.currency === 'KRW') totalKRW += item.amount;
    else totalJPY += item.amount;
  });
  document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW}원`;
  document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY}엔`;
}

// ===== 내역 표시 =====
async function loadList(filter='ALL') {
  const snapshot = await getDocs(expensesCol);
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const item = doc.data();
    if(filter === 'ALL' || item.currency === filter) {
      const li = document.createElement("li");
      li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place}`;
      list.appendChild(li);
    }
  });
}

// ===== 날짜별 조회 =====
async function showListByDate() {
  const start = document.getElementById("start-date").value;
  const end = document.getElementById("end-date").value;

  if(!start || !end) return alert("시작 날짜와 끝 날짜를 선택하세요.");

  const q = query(expensesCol, where("date", ">=", start), where("date", "<=", end));
  const snapshot = await getDocs(q);

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const item = doc.data();
    const li = document.createElement("li");
    li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place}`;
    list.appendChild(li);
  });
}

// ===== 초기 로드 =====
loadTotals();

// ===== 함수 전역으로 노출 =====
window.goHome = goHome;
window.showAdd = showAdd;
window.showList = showList;
window.saveExpense = saveExpense;
window.showListByDate = showListByDate;
