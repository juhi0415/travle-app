// ===== Firebase 설정 =====
const firebaseConfig = {
    apiKey: "AIzaSyC39VtjT_othwi_WIS_S4cdOH2CKnDyrZY",
    authDomain: "travle-app-9c1ee.firebaseapp.com",
    projectId: "travle-app-9c1ee",
    storageBucket: "travle-app-9c1ee.firebasestorage.app",
    messagingSenderId: "469444862658",
    appId: "1:469444862658:web:8cd5b52dd0f78e0c93915b"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== 화면 전환 =====
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
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.remove("hidden");

    document.getElementById("amount").value = "";
    document.getElementById("currency").value = "KRW";
    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
    document.getElementById("place").value = "";
}

function showList(currencyFilter) {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");

    loadList(currencyFilter);
}

function showDateFilter() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.remove("hidden");
}

// ===== 지출 관리 =====
let editId = null;

function saveExpense() {
    const amount = Number(document.getElementById("amount").value);
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if (!amount || !date || !place) {
        alert("모든 항목을 입력해주세요!");
        return;
    }

    const data = { amount, currency, date, place };

    if (editId) {
        db.collection("expenses").doc(editId).set(data).then(() => {
            alert("수정 완료!");
            editId = null;
            goHome();
        });
    } else {
        db.collection("expenses").add(data).then(() => {
            alert("저장 완료!");
            goHome();
        });
    }
}

// ===== 총액 로드 =====
function loadTotals() {
    db.collection("expenses").get().then(snapshot => {
        let totalKRW = 0, totalJPY = 0;
        snapshot.forEach(doc => {
            const item = doc.data();
            if(item.currency==="KRW") totalKRW += item.amount;
            else totalJPY += item.amount;
        });
        document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
        document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
    });
}

// ===== 지출 내역 표시 =====
function loadList(currencyFilter="ALL") {
    db.collection("expenses").orderBy("date").get().then(snapshot => {
        const list = document.getElementById("expense-list");
        list.innerHTML = "";

        snapshot.forEach(doc => {
            const item = doc.data();
            if(currencyFilter!=="ALL" && item.currency !== currencyFilter) return;

            const li = document.createElement("li");
            li.innerHTML = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place}
                            <button onclick="editExpense('${doc.id}')">✏️</button>
                            <button onclick="deleteExpense('${doc.id}')">🗑️</button>`;
            list.appendChild(li);
        });
    });
}

function editExpense(id) {
    db.collection("expenses").doc(id).get().then(doc => {
        const data = doc.data();
        document.getElementById("amount").value = data.amount;
        document.getElementById("currency").value = data.currency;
        document.getElementById("date").value = data.date;
        document.getElementById("place").value = data.place;
        editId = id;
        showAdd();
    });
}

function deleteExpense(id) {
    if(confirm("정말 삭제하시겠습니까?")) {
        db.collection("expenses").doc(id).delete().then(() => {
            loadList("ALL");
            loadTotals();
        });
    }
}

// ===== 날짜별 조회 =====
function viewByDate() {
    const date = document.getElementById("filter-date").value;
    if(!date) return alert("날짜를 선택해주세요!");

    db.collection("expenses").where("date","==",date).get().then(snapshot => {
        const list = document.getElementById("expense-list");
        list.innerHTML = "";
        snapshot.forEach(doc => {
            const item = doc.data();
            const li = document.createElement("li");
            li.innerHTML = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place}
                            <button onclick="editExpense('${doc.id}')">✏️</button>
                            <button onclick="deleteExpense('${doc.id}')">🗑️</button>`;
            list.appendChild(li);
        });
        showList("ALL");
    });
}

// ===== 초기 로드 =====
window.onload = () => {
    goHome();
};
