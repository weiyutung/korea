// --- 元素選擇器 ---
const tripList = document.getElementById('trip-list');
const submitBtn = document.getElementById('submit-btn');
const editIdInput = document.getElementById('edit-id');
const tripNameInput = document.getElementById('trip-name');
const tripTimeInput = document.getElementById('trip-time');
const tripCostInput = document.getElementById('trip-cost');
const tripNotesInput = document.getElementById('trip-notes');
const tripTypeSelect = document.getElementById('trip-type');
const totalCostElement = document.getElementById('total-cost');

// --- 資料結構 ---
let trips = [];
const STORAGE_KEY = 'koreaTrips';

// --- 輔助函數：從 LocalStorage 載入資料 ---
function loadTrips() {
    const storedTrips = localStorage.getItem(STORAGE_KEY);
    if (storedTrips) {
        trips = JSON.parse(storedTrips);
    } else {
        // 首次載入時的範例資料
        trips = [
            { id: Date.now() + 1, name: "抵達仁川國際機場 (ICN)", time: "10:00 - 11:00", cost: 50000, notes: "搭乘 AREX 直達首爾站", type: "交通" },
            { id: Date.now() + 2, name: "午餐: 王妃家烤肉 (明洞店)", time: "13:00 - 14:30", cost: 80000, notes: "一定要點雪花牛", type: "餐飲" },
            { id: Date.now() + 3, name: "南山谷韓屋村", time: "15:30 - 17:30", cost: 0, notes: "彈性：如果時間來不及就跳過。", type: "景點" }
        ];
    }
}

// --- 輔助函數：儲存資料到 LocalStorage ---
function saveTrips() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

// --- 渲染行程列表與計算總費用 ---
function renderTrips() {
    tripList.innerHTML = '';
    let totalCost = 0;

    if (trips.length === 0) {
        tripList.innerHTML = '<p class="placeholder">目前沒有行程，請新增。</p>';
        totalCostElement.textContent = `總花費: ₩ 0`;
        return;
    }

    trips.forEach((trip, index) => {
        // 計算總花費
        totalCost += parseFloat(trip.cost) || 0;

        // 建立行程卡片元素
        const card = document.createElement('div');
        card.classList.add('trip-card');
        card.dataset.id = trip.id; // 儲存 ID 供編輯/刪除使用

        // 根據類型設定側邊條顏色 (模擬圖片中的分類屬性)
        let typeColor = '#3b5998'; // 預設藍色
        switch (trip.type) {
            case '景點': typeColor = '#2196F3'; break;
            case '餐飲': typeColor = '#FF5722'; break;
            case '住宿': typeColor = '#4CAF50'; break;
        }
        card.style.borderLeftColor = typeColor;


        card.innerHTML = `
            <div class="order">${index + 1}.</div>
            <div class="trip-card-content">
                <h4>${trip.name} (${trip.type})</h4>
                <p class="time-cost">時間: ${trip.time || '未定'} | 花費: ₩ ${trip.cost.toLocaleString()}</p>
                <p>備註: ${trip.notes || '無'}</p>
            </div>
            <div class="trip-card-actions">
                <button class="edit-btn" onclick="prepareEdit(${trip.id})">✎</button>
                <button class="delete-btn" onclick="deleteTrip(${trip.id})">🗑️</button>
            </div>
        `;
        tripList.appendChild(card);
    });

    totalCostElement.textContent = `總花費: ₩ ${totalCost.toLocaleString()}`;
    saveTrips(); // 每次渲染後，儲存最新的資料
}

// --- 新增或更新行程 (核心邏輯) ---
function handleFormSubmit(event) {
    event.preventDefault();

    const name = tripNameInput.value.trim();
    const time = tripTimeInput.value.trim();
    const cost = parseFloat(tripCostInput.value) || 0;
    const notes = tripNotesInput.value.trim();
    const type = tripTypeSelect.value;
    const editId = editIdInput.value;

    if (!name) {
        alert('請輸入行程名稱！');
        return;
    }

    if (editId) {
        // --- 更新現有行程 ---
        const index = trips.findIndex(t => t.id == editId);
        if (index !== -1) {
            trips[index] = { id: parseInt(editId), name, time, cost, notes, type };
        }
        // 重設按鈕狀態
        submitBtn.textContent = '新增行程';
        editIdInput.value = '';
    } else {
        // --- 新增行程 ---
        const newTrip = {
            id: Date.now(), // 使用時間戳作為唯一 ID
            name,
            time,
            cost,
            notes,
            type
        };
        trips.push(newTrip);
    }

    // 清空表單
    tripNameInput.value = '';
    tripTimeInput.value = '';
    tripCostInput.value = '0';
    tripNotesInput.value = '';
    tripTypeSelect.value = '景點';

    renderTrips();
}

// --- 準備編輯狀態 (填充表單) ---
function prepareEdit(id) {
    const tripToEdit = trips.find(t => t.id === id);
    if (!tripToEdit) return;

    // 填充表單
    editIdInput.value = tripToEdit.id;
    tripNameInput.value = tripToEdit.name;
    tripTimeInput.value = tripToEdit.time;
    tripCostInput.value = tripToEdit.cost;
    tripNotesInput.value = tripToEdit.notes;
    tripTypeSelect.value = tripToEdit.type;

    // 改變按鈕文字
    submitBtn.textContent = `儲存變更 (ID: ${tripToEdit.id})`;

    // 將視窗捲動到表單頂部，方便編輯
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 刪除行程 ---
function deleteTrip(id) {
    if (confirm('確定要刪除這個行程嗎？')) {
        trips = trips.filter(trip => trip.id !== id);
        renderTrips();
    }
}

// --- 初始化應用程式 ---
function init() {
    loadTrips(); // 從 LocalStorage 載入資料
    renderTrips(); // 渲染介面

    // 監聽表單提交事件
    submitBtn.addEventListener('click', handleFormSubmit);

    // 讓整個表單可以按 Enter 提交
    document.querySelector('.add-section').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFormSubmit(e);
        }
    });
}

// 啟動應用程式
init();