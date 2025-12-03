let editId = null;

// 화면 전환 함수
function goHome() {
    hideAll();
    document.getElementById("home-screen").classList.remove("hidden");
    loadTotals();
}

function showAdd(isEdit = false) {
    hideAll();
    document.getElementById("add-screen").classList.remove("hidden");

    if (!isEdit) {
        editId = null;
        document.getElementById("amount").value = "";
        document.getElementById("currency").value = "KRW";
        document.getElementById("place").value = "";
        document.getElementById("date").value = new Date().toISOString().slice(0, 10);
    }
}

function showList(filter = "ALL") {
    hideAll();
    document.getElementById("list-screen").classList.remove("hidden");
    loadList(filter);
}

function showDateFilter() {
    hideAll();
    document.getElementById("date-filter-screen").classList.remove("hidden");
}

// 모든 화면 숨기기
function hideAll() {
    document.querySelectorAll(".container > div").forEach(div => div.classList.add("hidden"));
}

// 저장하기 (추가 or 수정)
function saveExpense() {
    const amount = Number(document.getElementById("amount").value);
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if (!amount || !date || !place) {
        alert("모든 항목을 입력해주세요!");
        return;
    }

    if (editId) {
        db.collection("expenses").doc(editId).update({
            amount, currency, date, place
        }).then(() => {
            editId = null;
            goHome();
        });
    } else {
        db.collection("expenses").add({
            amount, currency, date, place
        }).then(() => goHome());
    }
}

// 총액 계산
function loadTotals() {
    db.collection("expenses").get().then(snapshot => {
        let totalKRW = 0;
        let totalJPY = 0;

        snapshot.forEach(doc => {
            const item = doc.data();
            if (item.currency === "KRW") totalKRW += item.amount;
            else totalJPY += item.amount;
        });

        document.getElementById("total-krw").innerText =
            `KRW 총액: ${totalKRW.toLocaleString()}원`;
        document.getElementById("total-jpy").innerText =
            `JPY 총액: ${totalJPY.toLocaleString()}엔`;
    });
}

// 리스트 불러오기
function loadList(filter) {
    const list = document.getElementById("expense-list");
    list.innerHTML = "";

    db.collection("expenses").get().then(snapshot => {
        snapshot.forEach(doc => {
            const item = doc.data();
            const id = doc.id;

            if (filter !== "ALL" && item.currency !== filter) return;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place}
                <button onclick="editExpense('${id}')">수정</button>
                <button onclick="deleteExpense('${id}')">삭제</button>
            `;
            list.appendChild(li);
        });
    });
}

// 날짜별 보기 기능
function viewByDate() {
    const date = document.getElementById("filter-date").value;
    if (!date) return;

    hideAll();
    document.getElementById("list-screen").classList.remove("hidden");

    const list = document.getElementById("expense-list");
    list.innerHTML = "";

    db.collection("expenses").where("date", "==", date).get().then(snapshot => {
        snapshot.forEach(doc => {
            const item = doc.data();
            const li = document.createElement("li");
            li.innerHTML = `${item.date} | ${item.currency} ${item.amount.toLocaleString()} | ${item.place}`;
            list.appendChild(li);
        });
    });
}

// 수정
function editExpense(id) {
    editId = id;
    db.collection("expenses").doc(id).get().then(doc => {
        const data = doc.data();
        document.getElementById("amount").value = data.amount;
        document.getElementById("currency").value = data.currency;
        document.getElementById("date").value = data.date;
        document.getElementById("place").value = data.place;

        showAdd(true);
    });
}

// 삭제
function deleteExpense(id) {
    if (!confirm("정말 삭제할까요?")) return;
    db.collection("expenses").doc(id).delete().then(() => {
        showList("ALL");
    });
}
