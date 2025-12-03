let editId = null; // 수정 모드 감지용

// 1000단위 콤마
function formatNumber(num) {
    return num.toLocaleString("ko-KR");
}

// 화면 전환
function goHome() {
    hideAll();
    document.getElementById("home-screen").classList.remove("hidden");
    loadTotals();
}

function hideAll() {
    document.getElementById("add-screen").classList.add("hidden");
    document.getElementById("list-screen").classList.add("hidden");
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("date-filter-screen").classList.add("hidden");
}

function showAdd() {
    hideAll();
    document.getElementById("add-screen").classList.remove("hidden");
    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
    editId = null;
}

// 날짜 선택 화면
function showDateFilter() {
    hideAll();
    document.getElementById("date-filter-screen").classList.remove("hidden");
}

// Firestore 저장
function saveExpense() {
    const amount = Number(document.getElementById("amount").value);
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if (!amount || !date || !place) {
        alert("모든 항목을 입력하세요.");
        return;
    }

    if (editId) {
        // 수정
        db.collection("expenses").doc(editId).update({
            amount, currency, date, place
        });
        alert("수정 완료!");
    } else {
        // 추가
        db.collection("expenses").add({
            amount, currency, date, place
        });
        alert("저장 완료!");
    }

    goHome();
}

// 총합 불러오기
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
            `KRW 총액: ${formatNumber(totalKRW)}원`;

        document.getElementById("total-jpy").innerText =
            `JPY 총액: ${formatNumber(totalJPY)}엔`;
    });
}

// 리스트 표시
function showList(filter) {
    hideAll();
    document.getElementById("list-screen").classList.remove("hidden");

    db.collection("expenses")
        .orderBy("date", "desc")
        .get()
        .then(snapshot => {
            const list = document.getElementById("expense-list");
            list.innerHTML = "";

            snapshot.forEach(doc => {
                const item = doc.data();
                if (filter !== "ALL" && item.currency !== filter) return;

                const li = document.createElement("li");
                li.innerHTML = `
                    ${item.date} |
                    ${item.currency} ${formatNumber(item.amount)} |
                    ${item.place}
                    <button onclick="editExpense('${doc.id}')">✏ 수정</button>
                    <button onclick="deleteExpense('${doc.id}')">🗑 삭제</button>
                `;
                list.appendChild(li);
            });
        });
}

// 삭제
function deleteExpense(id) {
    if (confirm("정말 삭제할까요?")) {
        db.collection("expenses").doc(id).delete();
        showList("ALL");
    }
}

// 수정
function editExpense(id) {
    db.collection("expenses").doc(id).get().then(doc => {
        const item = doc.data();
        editId = id;

        document.getElementById("amount").value = item.amount;
        document.getElementById("currency").value = item.currency;
        document.getElementById("date").value = item.date;
        document.getElementById("place").value = item.place;

        hideAll();
        document.getElementById("add-screen").classList.remove("hidden");
    });
}

// 날짜별 조회
function viewByDate() {
    const date = document.getElementById("filter-date").value;
    if (!date) return alert("날짜를 선택하세요");

    hideAll();
    document.getElementById("list-screen").classList.remove("hidden");

    db.collection("expenses")
        .where("date", "==", date)
        .get()
        .then(snapshot => {
            const list = document.getElementById("expense-list");
            list.innerHTML = "";

            snapshot.forEach(doc => {
                const item = doc.data();
                const li = document.createElement("li");
                li.innerHTML = `
                    ${item.date} |
                    ${item.currency} ${formatNumber(item.amount)} |
                    ${item.place}
                    <button onclick="editExpense('${doc.id}')">✏ 수정</button>
                    <button onclick="deleteExpense('${doc.id}')">🗑 삭제</button>
                `;
                list.appendChild(li);
            });
        });
}
