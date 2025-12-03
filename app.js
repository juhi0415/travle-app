const expensesCollection = db.collection("expenses");

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
    document.getElementById("add-screen").classList.remove("hidden");
    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
}

function showList(filter = "ALL", filterDate = null) {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");
    loadList(filter, filterDate);
}

function showDateFilter() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.remove("hidden");
}

// ===== 저장/수정 기능 =====
function saveExpense(id = null) {
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if (!amount || !date || !place) {
        alert("모든 항목을 입력해주세요!");
        return;
    }

    const expenseData = {
        amount: Number(amount),
        currency,
        date,
        place,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (id) {
        expensesCollection.doc(id).set(expenseData)
            .then(() => { alert("수정 완료! ✅"); goHome(); });
    } else {
        expensesCollection.add(expenseData)
            .then(() => { alert("저장 완료! ✅"); goHome(); });
    }
}

// ===== 홈 화면 총액 =====
function loadTotals() {
    expensesCollection.get().then(snapshot => {
        let totalKRW = 0, totalJPY = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.currency === "KRW") totalKRW += data.amount;
            else totalJPY += data.amount;
        });
        document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
        document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
    });
}

// ===== 내역 표시 =====
function loadList(filter = "ALL", filterDate = null) {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";
    expensesCollection.orderBy("timestamp", "desc").get().then(snapshot => {
        snapshot.forEach(doc => {
            const item = doc.data();
            const id = doc.id;
            if ((filter !== "ALL" && item.currency !== filter) ||
                (filterDate && item.date !== filterDate)) return;

            const li = document.createElement("li");
            li.className = "expense-item";
            li.innerHTML = `
                <span>${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place}</span>
                <div>
                    <button class="edit-btn" onclick="editExpense('${id}')">✏️</button>
                    <button class="delete-btn" onclick="deleteExpense('${id}')">🗑️</button>
                </div>
            `;
            list.appendChild(li);
        });
    });
}

// ===== 삭제/수정 기능 =====
function deleteExpense(id) {
    if (confirm("삭제하시겠습니까?")) {
        expensesCollection.doc(id).delete().then(() => loadList());
    }
}

function editExpense(id) {
    expensesCollection.doc(id).get().then(doc => {
        const item = doc.data();
        document.getElementById("amount").value = item.amount;
        document.getElementById("currency").value = item.currency;
        document.getElementById("date").value = item.date;
        document.getElementById("place").value = item.place;
        document.getElementById("add-screen").dataset.editId = id;
        showAdd();
    });
}

// ===== 날짜별 보기 =====
function viewByDate() {
    const date = document.getElementById("filter-date").value;
    if (!date) { alert("날짜를 선택해주세요!"); return; }
    showList("ALL", date);
}

// ===== 저장 버튼 클릭 이벤트 =====
document.querySelector("#save-btn").addEventListener("click", () => {
    const id = document.getElementById("add-screen").dataset.editId;
    saveExpense(id || null);
    delete document.getElementById("add-screen").dataset.editId;
});
