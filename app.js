let editingId = null;

// ===== 화면 전환 =====
function goHome() {
    document.getElementById("home-screen").classList.remove("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    loadTotals();
}

function showAdd() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.remove("hidden");

    clearAddForm();
}

function showList(currencyFilter = "ALL") {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");

    const list = document.getElementById("expense-list");
    list.innerHTML = "";

    let query = db.collection("expenses");
    if (currencyFilter !== "ALL") {
        query = query.where("currency", "==", currencyFilter);
    }

    query.get().then(snapshot => {
        snapshot.forEach(doc => {
            const item = doc.data();
            const li = document.createElement("li");
            li.classList.add("expense-item");
            li.innerHTML = `
                ${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place}
                <div>
                    <button class="edit-btn" onclick="editExpense('${doc.id}')">✏️</button>
                    <button class="delete-btn" onclick="deleteExpense('${doc.id}')">🗑️</button>
                </div>
            `;
            list.appendChild(li);
        });
    });
}

// ===== 날짜별 보기 =====
function showDateFilter() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.remove("hidden");

    document.getElementById("filter-date").value = new Date().toISOString().slice(0, 10);
}

function viewByDate() {
    const filterDate = document.getElementById("filter-date").value;
    const list = document.getElementById("expense-list");
    list.innerHTML = "";
    db.collection("expenses").where("date", "==", filterDate).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const item = doc.data();
                const li = document.createElement("li");
                li.classList.add("expense-item");
                li.innerHTML = `
                    ${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place}
                    <div>
                        <button class="edit-btn" onclick="editExpense('${doc.id}')">✏️</button>
                        <button class="delete-btn" onclick="deleteExpense('${doc.id}')">🗑️</button>
                    </div>
                `;
                list.appendChild(li);
            });
        });
    goHome();
}

// ===== 입력폼 초기화 =====
function clearAddForm() {
    document.getElementById("amount").value = "";
    document.getElementById("currency").value = "KRW";
    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
    document.getElementById("place").value = "";
    editingId = null;
}

// ===== 저장 기능 =====
function saveExpense() {
    const amount = Number(document.getElementById("amount").value);
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if (!amount || !date || !place) {
        alert("모든 항목을 입력해주세요!");
        return;
    }

    const expense = { amount, currency, date, place };

    if (editingId) {
        db.collection("expenses").doc(editingId).set(expense)
        .then(() => {
            alert("수정 완료!");
            clearAddForm();
            goHome();
        });
    } else {
        db.collection("expenses").add(expense)
        .then(() => {
            alert("저장 완료!");
            clearAddForm();
            goHome();
        });
    }
}

// ===== 수정 / 삭제 =====
function editExpense(id) {
    db.collection("expenses").doc(id).get()
    .then(doc => {
        const data = doc.data();
        document.getElementById("amount").value = data.amount;
        document.getElementById("currency").value = data.currency;
        document.getElementById("date").value = data.date;
        document.getElementById("place").value = data.place;
        editingId = id;
        showAdd();
    });
}

function deleteExpense(id) {
    if (confirm("정말 삭제하시겠습니까?")) {
        db.collection("expenses").doc(id).delete()
        .then(() => {
            loadTotals();
            showList(); // 전체 갱신
        });
    }
}

// ===== 총액 표시 =====
function loadTotals() {
    db.collection("expenses").get()
    .then(snapshot => {
        let totalKRW = 0, totalJPY = 0;
        snapshot.forEach(doc => {
            const item = doc.data();
            if (item.currency === "KRW") totalKRW += item.amount;
            else totalJPY += item.amount;
        });
        document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
        document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
    });
}

// ===== 초기화 =====
goHome();
