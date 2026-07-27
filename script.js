// ======================
// 取得 HTML 元素
// ======================

const storeCount =
    document.getElementById("store-count");

const storeList =
    document.getElementById("store-list");

const storeRandomBtn =
    document.getElementById("store-random-btn");

const randomResult =
    document.getElementById("random-result");

const distanceButtons =
    document.querySelectorAll(".distance-btn");

const storeListPage =
    document.getElementById("store-list-page");

const storeDetailPage =
    document.getElementById("store-detail-page");

const backBtn =
    document.getElementById("back-btn");

const detailStoreName =
    document.getElementById("detail-store-name");

const detailStoreInfo =
    document.getElementById("detail-store-info");


// 目前選擇的距離範圍，預設為 500 公尺
let currentDistance = 500;


// 從 localStorage 取得已收藏的品牌
let favoriteBrands =
    JSON.parse(
        localStorage.getItem("favoriteBrands")
    ) || [];


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


    // 幫每一張店家卡片加上點擊事件
    const storeCards =
        document.querySelectorAll(".store-card");

    for (let i = 0; i < storeCards.length; i++) {
        storeCards[i].addEventListener(
            "click",
            function () {
                showStoreDetail(stores[i]);
            }
        );
    }
}


// 顯示店家詳細資訊
function showStoreDetail(store) {
    storeListPage.classList.remove("page--active");
    storeDetailPage.classList.add("page--active");

    detailStoreName.textContent = store.name;


    // 根據店家的 brand，尋找對應的品牌資料
    const brand = drinkBrands.find(
        drinkBrand =>
            drinkBrand.name === store.brand
    );


    let menuHtml = "";

    // 找到品牌才顯示菜單
    if (brand) {
        for (let i = 0; i < brand.menu.length; i++) {
            const item = brand.menu[i];

            menuHtml += `
                <div class="menu-item">
                    <span>${item}</span>
                </div>
            `;
        }
    } else {
        menuHtml = `
            <p>目前沒有這個品牌的菜單資料。</p>
        `;
    }


    detailStoreInfo.innerHTML = `
        <p>⭐ 評分：${store.rating}</p>

        <p>
            📍 距離：
            ${formatDistance(store.distance)}
        </p>

        <p>
            ${store.isOpen
                ? "🟢 營業中"
                : "🔴 已打烊"}
        </p>

        <a
            href="https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}"
            target="_blank"
            rel="noopener noreferrer"
        >
            🗺️ 在 Google Maps 開啟
        </a>

        <button id="favorite-btn">
            ♡ 收藏品牌
        </button>

        <h3>🧋 ${store.brand} 菜單</h3>

        ${menuHtml}
    `;


    const favoriteBtn =
        document.getElementById("favorite-btn");


    let isFavorite =
        favoriteBrands.includes(store.brand);


    updateFavoriteButton(
        favoriteBtn,
        isFavorite
    );


    favoriteBtn.addEventListener(
        "click",
        function () {
            isFavorite = !isFavorite;

            if (isFavorite) {
                // 避免同一個品牌重複加入
                if (!favoriteBrands.includes(store.brand)) {
                    favoriteBrands.push(store.brand);
                }
            } else {
                favoriteBrands =
                    favoriteBrands.filter(
                        brandName =>
                            brandName !== store.brand
                    );
            }

            updateFavoriteButton(
                favoriteBtn,
                isFavorite
            );

            localStorage.setItem(
                "favoriteBrands",
                JSON.stringify(favoriteBrands)
            );
        }
    );
}


// 更新收藏按鈕文字
function updateFavoriteButton(
    favoriteBtn,
    isFavorite
) {
    if (isFavorite) {
        favoriteBtn.textContent =
            "♥ 已收藏品牌";
    } else {
        favoriteBtn.textContent =
            "♡ 收藏品牌";
    }
}


// 顯示符合條件的店家數量
function renderStoreCount(stores) {
    storeCount.textContent =
        `目前共有 ${stores.length} 間飲料店`;
}


// 取得營業中且符合距離的店家
function getOpenStores(maxDistance) {
    const openStores =
        drinkStores.filter(
            store =>
                store.isOpen &&
                store.distance <= maxDistance
        );
    // 依照距離由近到遠排序
    openStores.sort(
        (a, b) =>
            a.distance - b.distance
    );

    return openStores;
}


// 顯示隨機選中的店家
function renderRandomStore(store) {
    randomResult.innerHTML = `
        <div class="random-card">
            <div class="random-card__eyebrow">
                抽到了
            </div>

            <div class="random-card__store">
                ${store.name}
            </div>

            <div class="random-card__meta">
                <span>⭐ ${store.rating}</span>

                <span>
                    📍 ${formatDistance(store.distance)}
                </span>
            </div>

            <div class="random-card__barcode"></div>
        </div>
    `;

    // 點擊隨機卡片時，顯示店家詳細資訊
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


    // 使用定位建立假店家的實際座標
    for (let i = 0; i < drinkStores.length; i++) {
        const store = drinkStores[i];

        store.latitude =
            myLatitude + store.latitudeOffset;

        store.longitude =
            myLongitude + store.longitudeOffset;


        const distance =
            calculateDistance(
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
    console.error(
        "定位失敗：",
        error
    );

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
        Math.sin(
            latitudeDifference / 2
        ) ** 2 +

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


// 依照目前選擇的距離更新畫面
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
            alert(
                "目前沒有符合條件的營業中店家"
            );

            return;
        }
        // 產生隨機索引
        const randomIndex =
            Math.floor(
                Math.random() *
                openStores.length
            );
        // 取得隨機店家
        const randomStore =
            openStores[randomIndex];

        renderRandomStore(randomStore);
    }
);


// 切換距離篩選
distanceButtons.forEach(
    function (btn) {
        btn.addEventListener(
            "click",
            function () {
                distanceButtons.forEach(
                    function (button) {
                        button.classList.remove(
                            "is-active"
                        );
                    }
                );

                btn.classList.add(
                    "is-active"
                );

                currentDistance =
                    Number(
                        btn.dataset.distance
                    );

                updateStoreList();

                randomResult.innerHTML = "";
            }
        );
    }
);


// 返回店家列表頁面
backBtn.addEventListener(
    "click",
    function () {
        storeListPage.classList.add(
            "page--active"
        );

        storeDetailPage.classList.remove(
            "page--active"
        );
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