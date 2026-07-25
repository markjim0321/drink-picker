// ======================
// 假資料
// ======================

const drinkStores = [
    {
        name: "珍珠茶坊",
        latitude: 25.085,
        longitude: 121.470,
        rating: 4.5,
        isOpen: true
    },
    {
        name: "五十嵐",
        latitude: 25.080,
        longitude: 121.480,
        rating: 4.2,
        isOpen: true
    },
    {
        name: "茶湯會",
        latitude: 25.075,
        longitude: 121.460,
        rating: 4.0,
        isOpen: true
    },
    {
        name: "CoCo都可",
        latitude: 25.070,
        longitude: 121.455,
        rating: 4.3,
        isOpen: true
    }
];


// ======================
// 取得 HTML 元素
// ======================

const storeCount = document.getElementById("store-count");

const storeList = document.getElementById("store-list");

const storeRandomBtn =
    document.getElementById("store-random-btn");

const randomResult = document.getElementById("random-result");

const distanceFilter = document.getElementById("distance-filter");

const storeListPage = document.getElementById("store-list-page");

const storeDetailPage = document.getElementById("store-detail-page");

const backBtn = document.getElementById("back-btn");

const detailStoreName = document.getElementById("detail-store-name");

// ======================
// Functions
// ======================

// 顯示飲料店列表
function renderStores(stores) {
    let html = "";

    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];

        html += `
            <div class="store-card">
                <h3>${store.name}</h3>
                <p>⭐ 評分：${store.rating}</p>
                <p>📍 距離：${formatDistance(store.distance)}</p>
                <p>
                    ${store.isOpen
                        ? "🟢 營業中"
                        : "🔴 已打烊"}
                </p>
            </div>
        `;
    }

    if (stores.length === 0) {
        html = `
            <p>目前這個距離內沒有營業中的飲料店。</p>
        `;
    }

    storeList.innerHTML = html;
    // 為每個店家卡片加上點擊事件 點開來可以看到店家詳細資訊
    const storeCards = document.querySelectorAll(".store-card");
    console.log(storeCards);

    for (let i = 0; i < storeCards.length; i++) {
    storeCards[i].addEventListener("click", function () {
        showStoreDetail(stores[i]);
    });
}
}

// 關閉店家列表頁面，顯示店家詳細資訊頁面
function showStoreDetail(store) {
    storeListPage.style.display = "none";
    storeDetailPage.style.display = "block";
    detailStoreName.textContent = store.name;
}



// 顯示飲料店數量
function renderStoreCount(stores) {
    storeCount.textContent =
        `目前共有 ${stores.length} 間飲料店`;
}


// 取得營業中且符合距離的店家
function getOpenStores(maxDistance) {
    const openStores = drinkStores.filter(
        store =>
            store.isOpen &&
            store.distance <= maxDistance
    );

    openStores.sort(
        (a, b) => a.distance - b.distance
    );

    return openStores;
}


// 顯示隨機選中的店家
function renderRandomStore(store) {
    randomResult.innerHTML = `
        <div class="random-card">
            <h2>🎉 今天就喝這間！</h2>
            <h3>${store.name}</h3>
            <p>⭐ ${store.rating}</p>
            <p>📍 ${formatDistance(store.distance)}</p>
        </div>
    `;
}


// 格式化距離
function formatDistance(distance) {
    if (distance < 1000) {
        return `${distance} 公尺`;
    }

    return `${(distance / 1000).toFixed(1)} 公里`;
}


// 取得使用者位置成功後執行
function showPosition(position) {
    const myLatitude =
        position.coords.latitude;

    const myLongitude =
        position.coords.longitude;

    for (let i = 0; i < drinkStores.length; i++) {
        const store = drinkStores[i];

        const distance = calculateDistance(
            myLatitude,
            myLongitude,
            store.latitude,
            store.longitude
        );

        store.distance =
            Math.round(distance);
    }

    console.table(drinkStores);

    updateStoreList();
}


// 取得位置失敗後執行
function showPositionError(error) {
    console.error("定位失敗：", error);

    storeCount.textContent =
        "無法取得你的位置";

    storeList.innerHTML = `
        <p>
            請確認瀏覽器已允許位置權限，
            然後重新整理網頁。
        </p>
    `;
}


// 計算兩個座標之間的距離
function calculateDistance(
    myLatitude,
    myLongitude,
    storeLatitude,
    storeLongitude
) {
    const earthRadius = 6371000;

    const latitudeDifference =
        (storeLatitude - myLatitude) *
        Math.PI / 180;

    const longitudeDifference =
        (storeLongitude - myLongitude) *
        Math.PI / 180;

    const a =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(
            myLatitude * Math.PI / 180
        ) *
        Math.cos(
            storeLatitude * Math.PI / 180
        ) *
        Math.sin(
            longitudeDifference / 2
        ) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}


// 依照目前篩選距離更新畫面
function updateStoreList() {
    const maxDistance =
        Number(distanceFilter.value);

    const openStores =
        getOpenStores(maxDistance);

    renderStoreCount(openStores);

    renderStores(openStores);
}


// ======================
// 事件監聽
// ======================

// 隨機選一家店
storeRandomBtn.addEventListener(
    "click",
    function () {
        const maxDistance =
            Number(distanceFilter.value);

        const openStores =
            getOpenStores(maxDistance);

        if (openStores.length === 0) {
            alert("目前沒有符合條件的營業中店家");
            return;
        }

        const randomIndex =
            Math.floor(
                Math.random() *
                openStores.length
            );

        const randomStore =
            openStores[randomIndex];

        renderRandomStore(randomStore);
    }
);


// 切換距離篩選器
distanceFilter.addEventListener(
    "change",
    function () {
        updateStoreList();

        randomResult.innerHTML = "";
    }
);

// 返回列表頁面
backBtn.addEventListener(
    "click", 
    function () {
        storeListPage.style.display = "block";
        storeDetailPage.style.display = "none";
    }
);

// ======================
// 初始化
// ======================

storeCount.textContent =
    "正在取得你的位置...";

storeList.innerHTML = `
    <p>請稍候，正在計算附近飲料店。</p>
`;

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        showPosition,
        showPositionError
    );
} else {
    storeCount.textContent =
        "你的瀏覽器不支援定位功能";

    storeList.innerHTML = `
        <p>請使用支援定位功能的瀏覽器。</p>
    `;
}