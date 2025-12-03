// 화면 전환
function goHome() {
    hideAllScreens();
    document.getElementById("home-screen").classList.remove("hidden");
    loadTotals();
}

function showAdd() {
    hideAllScreens();
    document.getElementById("add-screen").classList.remove("hidden");
    document.getElementById("amount").value = "";
    document.getElementById("place").value = "";
    document.getElementById("date").value = new Date().toISOString().slice(0,10);
    document.getElementById("currency").value = "KRW";
}

function showList(filter) {
    hideAllScreens();
    document.getElementById("list-screen").classList.remove("hidden");
    loadList(filter);
}

function showByDate() {
    hideAllScreens();
    document.getElementById("date-screen").classList.remove("hidden");
}

function hideAllScreens() {
    ["home-screen","add-screen","list-screen","date-screen"].forEach(id=>{
        document.getElementById(id).classList.add("hidden");
    });
}

// 데이터 관리
function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
}
function saveExpenses(data) {
    localStorage.setItem("expenses", JSON.stringify(data));
}

// 저장 기능
function saveExpense() {
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;
    const date = document.getElementById("date").value;
    const place = document.getElementById("place").value;

    if(!amount || !date || !place){
        alert("모든 항목을 입력해주세요!");
        return;
    }

    const expenses = getExpenses();
    expenses.push({amount: Number(amount), currency, date, place});
    saveExpenses(expenses);
    alert("저장되었습니다!");
    goHome();
}

// 총액 표시
function loadTotals() {
    const expenses = getExpenses();
    let totalKRW=0, totalJPY=0;
    expenses.forEach(e=>{
        if(e.currency==="KRW") totalKRW+=e.amount;
        else totalJPY+=e.amount;
    });
    document.getElementById("total-krw").innerText=`KRW 총액: ${totalKRW.toLocaleString()}원`;
    document.getElementById("total-jpy").innerText=`JPY 총액: ${totalJPY.toLocaleString()}엔`;
}

// 내역 표시
function loadList(filter){
    const list = document.getElementById("expense-list");
    list.innerHTML="";
    const expenses = getExpenses().filter(e=>{
        if(filter==="ALL") return true;
        return e.currency===filter;
    });
    expenses.forEach((e,i)=>{
        const li=document.createElement("li");
        li.innerHTML = `${e.date} | ${e.currency} ${e.amount.toLocaleString()} | ${e.place} 
            <button onclick="editExpense(${i})">✏️</button>
            <button onclick="deleteExpense(${i})">🗑️</button>`;
        list.appendChild(li);
    });
}

// 날짜별 조회
function viewByDate(){
    const date = document.getElementById("filter-date").value;
    if(!date){ alert("날짜를 선택!"); return; }
    const list = document.getElementById("date-expense-list");
    list.innerHTML="";
    const expenses = getExpenses().filter(e=>e.date===date);
    expenses.forEach((e,i)=>{
        const li=document.createElement("li");
        li.innerHTML = `${e.date} | ${e.currency} ${e.amount.toLocaleString()} | ${e.place}`;
        list.appendChild(li);
    });
}

// 수정 삭제
function editExpense(index){
    const expenses = getExpenses();
    const e = expenses[index];
    showAdd();
    document.getElementById("amount").value = e.amount;
    document.getElementById("currency").value = e.currency;
    document.getElementById("date").value = e.date;
    document.getElementById("place").value = e.place;
    deleteExpense(index);
}
function deleteExpense(index){
    const expenses = getExpenses();
    expenses.splice(index,1);
    saveExpenses(expenses);
    loadTotals();
    loadList("ALL");
}
