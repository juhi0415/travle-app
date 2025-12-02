// ===== Firebase 설정 =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const expensesCol = db.collection("expenses");

// ===== 화면 전환 =====
let editId = null;

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

// ===== 저장 / 수정 =====
function saveExpense() {
    const amount = Number(document.getElementById("amount").value);
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if (!amount || !date || !place) { alert("모든 항목을 입력해주세요!"); return; }

    const data = { amount, currency, date, place };

    if (editId) {
        expensesCol.doc(editId).set(data).then(() => {
            alert("수정 완료!");
            editId = null;
        });
    } else {
        expensesCol.add(data).then(() => alert("저장 완료!"));
    }
    goHome();
}

// ===== 목록 및 수정 =====
function loadList(currencyFilter = "ALL") {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";
    expensesCol.get().then(snapshot => {
        snapshot.forEach(doc => {
            const item = doc.data();
            const id = doc.id;
            if (currencyFilter !== "ALL" && item.currency !== currencyFilter) return;

            const li = document.createElement("li");
            li.textContent = `${item.date} | ${item.currency} ${item.amount} | ${item.place} `;

            const editBtn = document.createElement("button");
            editBtn.textContent = "수정";
            editBtn.addEventListener("click", () => editExpense(id, item));
            li.appendChild(editBtn);

            list.appendChild(li);
        });
    });
}

function editExpense(id, item) {
    document.getElementById("amount").value = item.amount;
    document.getElementById("currency").value = item.currency;
    document.getElementById("date").value = item.date;
    document.getElementById("place").value = item.place;
    editId = id;
    showAdd();
}

// ===== 총액 계산 =====
function loadTotals() {
    let totalKRW = 0, totalJPY = 0;
    expensesCol.get().then(snapshot => {
        snapshot.forEach(doc => {
            const item = doc.data();
            if (item.currency === "KRW") totalKRW += item.amount;
            else totalJPY += item.amount;
        });
        document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW}원`;
        document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY}엔`;
    });
}
