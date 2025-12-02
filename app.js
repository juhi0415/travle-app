// ===== Firebase 초기화 =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const expensesCol = db.collection("expenses");

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

// ===== 로컬 → Firebase 동기화 =====
function syncLocalToFirebase() {
  const localExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  if (!localExpenses.length) return alert("로컬 데이터가 없습니다.");

  let count = 0;
  localExpenses.forEach(item => {
    expensesCol.add(item)
      .then(() => {
        count++;
        if (count === localExpenses.length) {
          alert("로컬 데이터 Firebase로 업로드 완료!");
          localStorage.removeItem("expenses");
          loadTotals();
        }
      })
      .catch(err => console.error("업로드 실패:", err));
  });
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

  expensesCol.add({amount, currency, date, place})
    .then(() => {
      alert("저장 완료!");
      goHome();
    })
    .catch(err => console.error("저장 실패:", err));
}

// ===== 총액 표시 =====
function loadTotals() {
  expensesCol.get().then(snapshot => {
    let totalKRW = 0;
    let totalJPY = 0;

    snapshot.forEach(doc => {
      const item = doc.data();
      if (item.currency === "KRW") totalKRW += item.amount;
      else totalJPY += item.amount;
    });

    document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW}원`;
    document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY}엔`;
  });
}

// ===== 내역 표시 (통화별/전체) =====
function loadList(filter = 'ALL') {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  let query = expensesCol;
  if (filter === 'KRW') query = expensesCol.where("currency", "==", "KRW");
  if (filter === 'JPY') query = expensesCol.where("currency", "==", "JPY");

  query.get().then(snapshot => {
    snapshot.forEach(doc => {
      const item = doc.data();
      const li = document.createElement("li");
      li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place}`;
      list.appendChild(li);
    });
  });
}

// ===== 날짜별 조회 =====
function showListByDate() {
  const start = document.getElementById("start-date").value;
  const end = document.getElementById("end-date").value;

  if (!start || !end) {
    return alert("시작 날짜와 끝 날짜를 모두 선택해주세요.");
  }

  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("add-screen").classList.add("hidden");
  document.getElementById("list-screen").classList.remove("hidden");

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  expensesCol
    .where("date", ">=", start)
    .where("date", "<=", end)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const item = doc.data();
        const li = document.createElement("li");
        li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place}`;
        list.appendChild(li);
      });
    });
}
