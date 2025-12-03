// ===== 서비스 워커 등록 =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('ServiceWorker 등록 완료:', reg))
      .catch(err => console.log('ServiceWorker 등록 실패:', err));
  });
}

// ===== 데이터 초기화 방지 =====
function getExpenses() {
  const data = localStorage.getItem('expenses');
  return data ? JSON.parse(data) : [];
}

function saveExpenses(data) {
  localStorage.setItem('expenses', JSON.stringify(data));
}

// ===== 저장 기능 =====
function saveExpense() {
  const amount = document.getElementById("amount").value;
  const currency = document.getElementById("currency").value;
  const date = document.getElementById("date").value;
  const place = document.getElementById("place").value;

  if (!amount || !date || !place) {
    alert("모든 항목을 입력해주세요!");
    return;
  }

  const expenses = getExpenses();
  expenses.push({ amount: Number(amount), currency, date, place });
  saveExpenses(expenses);

  alert("저장되었습니다!"); // 저장 완료 메세지
  clearForm(); // 폼 초기화
  goHome();
}

// ===== 폼 초기화 =====
function clearForm() {
  document.getElementById("amount").value = '';
  document.getElementById("currency").value = 'KRW';
  document.getElementById("date").value = new Date().toISOString().slice(0,10);
  document.getElementById("place").value = '';
}
