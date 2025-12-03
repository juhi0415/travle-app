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
    document.getElementById("date").value = new Date().toISOString().slice(0,10);
}

function showList(currency="ALL", date=null) {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.remove("hidden");

    db.collection("expenses").get().then(snapshot => {
        const list = document.getElementById("expense-list");
        list.innerHTML = "";

        let totalKRW = 0;
        let totalJPY = 0;

        snapshot.forEach(doc => {
            const item = doc.data();
            if(currency !== "ALL" && item.currency !== currency) return;
            if(date && item.date !== date) return;

            if(item.currency === "KRW") totalKRW += item.amount;
            else totalJPY += item.amount;

            const li = document.createElement("li");
            li.innerHTML = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place} 
                            <button onclick="deleteExpense('${doc.id}')">삭제</button>`;
            list.appendChild(li);
        });

        document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
        document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
    });
}

function showDateFilter() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.remove("hidden");
}

function viewByDate() {
    const date = document.getElementById("filter-date").value;
    if(!date) { alert("날짜를 선택하세요"); return; }
    showList("ALL", date);
}

// ===== 저장/삭제 =====
function saveExpense() {
    const amount = Number(document.getElementById("amount").value);
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if(!amount || !date || !place) { alert("모든 항목을 입력해주세요"); return; }

    db.collection("expenses").add({amount, currency, date, place})
    .then(() => { alert("저장 완료"); goHome(); });
}

function deleteExpense(id) {
    if(!confirm("정말 삭제할까요?")) return;
    db.collection("expenses").doc(id).delete().then(() => loadTotals());
}

// ===== 총액 로딩 =====
function loadTotals() {
    db.collection("expenses").get().then(snapshot => {
        let totalKRW = 0;
        let totalJPY = 0;

        snapshot.forEach(doc => {
            const item = doc.data();
            if(item.currency === "KRW") totalKRW += item.amount;
            else totalJPY += item.amount;
        });

        document.getElementById("total-krw").innerText = `KRW 총액: ${totalKRW.toLocaleString()}원`;
        document.getElementById("total-jpy").innerText = `JPY 총액: ${totalJPY.toLocaleString()}엔`;
    });
}

loadTotals();
