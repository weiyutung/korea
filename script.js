// ... [保持之前的元素選擇器] ...
const tripList = document.getElementById('trip-list');
// ... [其他選擇器] ...

// 🎯 新增即時資訊選擇器
const liveTimeElement = document.getElementById('live-time');

// ... [保持 loadTrips, saveTrips 函數] ...


// --- 渲染行程列表 (修改以包含拖曳把手) ---
function renderTrips() {
    tripList.innerHTML = '';
    let totalCost = 0;

    if (trips.length === 0) {
        tripList.innerHTML = '<p class="placeholder">目前沒有行程，請新增。</p>';
        totalCostElement.textContent = `總花費: ₩ 0`;
        return;
    }

    trips.forEach((trip, index) => {
        totalCost += parseFloat(trip.cost) || 0;

        const card = document.createElement('div');
        card.classList.add('trip-card');
        card.dataset.id = trip.id;

        // ... [保持 typeColor 邏輯] ...
        let typeColor = '#3b5998';
        switch (trip.type) {
            case '景點': typeColor = '#2196F3'; break;
            case '餐飲': typeColor = '#FF5722'; break;
            case '住宿': typeColor = '#4CAF50'; break;
            case '購物': typeColor = '#FFC107'; break;
            case '交通': typeColor = '#9E9E9E'; break;
        }
        card.style.borderLeftColor = typeColor;


        card.innerHTML = `
            <div class="drag-handle">⋮⋮</div> 
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
    saveTrips();
}

// ... [保持 handleFormSubmit, prepareEdit, deleteTrip 函數] ...


// --- 🎯 新功能 1: 實作即時時間顯示 (功能 3 - 即時時間) ---
function updateLiveTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = now.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' });
    liveTimeElement.innerHTML = `🕗 ${formattedDate} ${formattedTime} (首爾時間)`;
}

// --- 🎯 新功能 2: 實作拖曳排序 (功能 2 - 調整位置) ---
function initSortable() {
    new Sortable(tripList, {
        animation: 150, // 拖曳動畫速度
        handle: '.drag-handle', // 只有點擊 '⋮⋮' 時才能拖曳
        onEnd: function (evt) {
            // 取得被移動的行程
            const item = trips[evt.oldIndex];

            // 從舊位置移除，並插入到新位置
            trips.splice(evt.oldIndex, 1);
            trips.splice(evt.newIndex, 0, item);

            // 重新渲染介面以更新順序編號和 LocalStorage
            renderTrips();
        },
    });
}


// --- 初始化應用程式 ---
function init() {
    loadTrips();
    renderTrips();

    // 啟動拖曳排序
    initSortable();

    // 啟動即時時間更新 (每秒更新一次)
    updateLiveTime();
    setInterval(updateLiveTime, 1000);

    // 監聽表單提交事件
    submitBtn.addEventListener('click', handleFormSubmit);

    // ... [保持 Enter 提交邏輯] ...
}

// 啟動應用程式
init();