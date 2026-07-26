// ======================
// 假資料
// ======================

let drinkStores = [];

// ======================
// 取得 HTML 元素
// ======================

const storeCount = document.getElementById("store-count");
const storeList = document.getElementById("store-list");
const storeRandomBtn = document.getElementById("store-random-btn");
const randomResult = document.getElementById("random-result");
const distanceButtons = document.querySelectorAll(".distance-btn");
const storeListPage = document.getElementById("store-list-page");
const storeDetailPage = document.getElementById("store-detail-page");
const backBtn = document.getElementById("back-btn");
const detailStoreName = document.getElementById("detail-store-name");
const detailStoreInfo = document.getElementById("detail-store-info");

// 目前選擇的距離篩選（公尺），預設 500 公尺
let currentDistance = 500;

// ======================
// Functions
// ======================

// 顯示飲料店列表
function renderStores(stores) {
    let html = "";

    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];

        html += `
            <div class="store-card ${store.isOpen ? "is-open" : "is-closed"}">
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

    for (let i = 0; i < storeCards.length; i++) {
        storeCards[i].addEventListener("click", function () {
            showStoreDetail(stores[i]);
        });
    }
}

// 關閉店家列表頁面，顯示店家詳細資訊頁面
function showStoreDetail(store) {
    storeListPage.classList.remove("page--active");
    storeDetailPage.classList.add("page--active");

    detailStoreName.textContent = store.name;

    let menuHtml = "";

    const menu = store.menu || [];

    for (let i = 0; i < menu.length; i++) {
        const item = menu[i];

        menuHtml += `
            <div class="menu-item">
                <span>${item.name}</span>
                <span>NT$ ${item.price}</span>
            </div>
        `;
    }

    detailStoreInfo.innerHTML = `
        <p>⭐ 評分：${store.rating}</p>
        <p>📍 距離：${formatDistance(store.distance)}</p>
        <p>${store.isOpen ? "🟢 營業中" : "🔴 已打烊"}</p>
        <a
            href="https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}"
            target="_blank"
            rel="noopener noreferrer"
        >
            🗺️ 在 Google Maps 開啟
        </a>

        <h3>🧋 菜單</h3>

        ${menuHtml}
    `;
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
            <div class="random-card__eyebrow">抽到了</div>
            <div class="random-card__store">${store.name}</div>
            <div class="random-card__meta">
                <span>⭐ ${store.rating}</span>
                <span>📍 ${formatDistance(store.distance)}</span>
            </div>
         <div class="random-card__barcode"></div>
        </div>
    `;

    const randomCard =
        document.querySelector(".random-card");

    randomCard.addEventListener(
        "click",
        function () {
            showStoreDetail(store);
        }
    );
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

    // 根據使用者的位置建立附近的假店家
    drinkStores = [
        {
            name: "珍珠茶坊",
            latitude: myLatitude + 0.001,
            longitude: myLongitude,
            rating: 4.5,
            isOpen: true,

            menu: [
                { name: "四季春", price: 35 },
                { name: "珍珠奶茶", price: 65 },
                { name: "紅茶拿鐵", price: 60 }
            ]
        },
        {
            name: "五十嵐",
            latitude: myLatitude - 0.002,
            longitude: myLongitude + 0.001,
            rating: 4.2,
            isOpen: true,

            menu: [
                { name: "四季春", price: 35 },
                { name: "珍珠奶茶", price: 65 },
                { name: "紅茶拿鐵", price: 60 }
            ]
        },
        {
            name: "茶湯會",
            latitude: myLatitude,
            longitude: myLongitude - 0.003,
            rating: 4.0,
            isOpen: true,

            menu: [
                { name: "觀音拿鐵", price: 65 },
                { name: "翡翠檸檬", price: 55 },
                { name: "珍珠紅豆拿鐵", price: 70 }
            ]
        },
        {
            name: "CoCo都可",
            latitude: myLatitude + 0.006,
            longitude: myLongitude,
            rating: 4.3,
            isOpen: true,

            menu: [
                { name: "百香雙響炮", price: 65 },
                { name: "奶茶三兄弟", price: 70 },
                { name: "珍珠奶茶", price: 60 }
            ]
        }
    ];

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
        Math.cos(myLatitude * Math.PI / 180) *
        Math.cos(storeLatitude * Math.PI / 180) *
        Math.sin(longitudeDifference / 2) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}

// 依照目前篩選距離更新畫面
function updateStoreList() {
    const openStores =
        getOpenStores(currentDistance);

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
        const openStores =
            getOpenStores(currentDistance);

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

// 切換距離篩選（藥丸型按鈕）
distanceButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        distanceButtons.forEach(function (b) {
            b.classList.remove("is-active");
        });

        btn.classList.add("is-active");

        currentDistance = Number(btn.dataset.distance);

        updateStoreList();

        randomResult.innerHTML = "";
    });
});

// 返回列表頁面
backBtn.addEventListener(
    "click",
    function () {
        storeListPage.classList.add("page--active");
        storeDetailPage.classList.remove("page--active");
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