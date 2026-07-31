// ======================
// 取得 HTML 元素
// ======================

const storeCount =
    document.getElementById("store-count");

const storeList =
    document.getElementById("store-list");

const favoriteBrandList =
    document.getElementById("favorite-brand-list");

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

const detailStoreHeader =
    document.getElementById("detail-store-header");

const detailStoreInfo =
    document.getElementById("detail-store-info");


// ======================
// 全域變數
// ======================

// 目前選擇的距離，預設 500 公尺
let currentDistance = 500;


// Google Places 搜尋回來的店家
let currentStores = [];


// 從 localStorage 取得收藏品牌
let favoriteBrands =
    JSON.parse(
        localStorage.getItem("favoriteBrands")
    ) || [];


// ======================
// 共用函式
// ======================


// 格式化距離
function formatDistance(distance) {
    if (distance < 1000) {
        return `${distance} 公尺`;
    }

    return `${(distance / 1000).toFixed(1)} 公里`;
}


// 更新收藏按鈕文字
function updateFavoriteButton(
    favoriteBtn,
    isFavorite
) {
    if (!favoriteBtn) {
        return;
    }

    if (isFavorite) {
        favoriteBtn.textContent =
            "★";

        favoriteBtn.setAttribute(
            "aria-label",
            "取消收藏品牌"
        );

        favoriteBtn.classList.add(
            "is-favorite"
        );
    } else {
        favoriteBtn.textContent =
            "☆";

        favoriteBtn.setAttribute(
            "aria-label",
            "收藏品牌"
        );

        favoriteBtn.classList.remove(
            "is-favorite"
        );
    }
}


// 儲存收藏品牌
function saveFavoriteBrands() {
    localStorage.setItem(
        "favoriteBrands",
        JSON.stringify(favoriteBrands)
    );
}


// 切換品牌收藏狀態
function toggleFavoriteBrand(brandName) {
    if (!brandName) {
        return;
    }

    const isFavorite =
        favoriteBrands.includes(brandName);

    if (isFavorite) {
        favoriteBrands =
            favoriteBrands.filter(
                favoriteBrand =>
                    favoriteBrand !== brandName
            );
    } else {
        favoriteBrands.push(brandName);
    }

    saveFavoriteBrands();
}


// 計算兩個座標之間的距離
function calculateDistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
) {
    const earthRadius = 6371000;

    const latitudeDifference =
        (latitude2 - latitude1) *
        Math.PI / 180;

    const longitudeDifference =
        (longitude2 - longitude1) *
        Math.PI / 180;

    const a =
        Math.sin(
            latitudeDifference / 2
        ) ** 2 +

        Math.cos(
            latitude1 * Math.PI / 180
        ) *

        Math.cos(
            latitude2 * Math.PI / 180
        ) *

        Math.sin(
            longitudeDifference / 2
        ) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return Math.round(
        earthRadius * c
    );
}


// 根據 Google 店名判斷品牌
function getBrandFromStoreName(storeName) {
    if (!storeName) {
        return "";
    }

    const normalizedStoreName =
        storeName.toLowerCase();

    const matchedBrand =
        drinkBrands.find(
            function (brand) {
                return brand.keywords.some(
                    function (keyword) {
                        return normalizedStoreName.includes(
                            keyword.toLowerCase()
                        );
                    }
                );
            }
        );

    if (matchedBrand) {
        return matchedBrand.name;
    }

    return "";
}


// ======================
// 店家列表
// ======================


// 顯示店家數量
function renderStoreCount(stores) {
    storeCount.textContent =
        `目前共有 ${stores.length} 間飲料店`;
}


// 取得營業中且符合距離的店家
function getOpenStores(maxDistance) {
    const openStores =
        currentStores.filter(
            store =>
                store.isOpen &&
                store.distance <= maxDistance
        );

    openStores.sort(
        (a, b) =>
            a.distance - b.distance
    );

    return openStores;
}


// 顯示飲料店列表
function renderStores(stores) {
    let html = "";

    for (
        let i = 0;
        i < stores.length;
        i++
    ) {
        const store = stores[i];

        const hasBrandData =
            store.brand !== "";

        const isFavorite =
            hasBrandData &&
            favoriteBrands.includes(
                store.brand
            );

        html += `
            <div
                class="
                    store-card
                    ${
                        store.isOpen
                            ? "is-open"
                            : "is-closed"
                    }
                "
            >
                <h3>${store.name}</h3>

                <p>
                    ⭐ 評分：
                    ${
                        store.rating > 0
                            ? store.rating
                            : "暫無評分"
                    }
                </p>

                <div class="store-info-row">
                    <p>
                        📍 距離：
                        ${formatDistance(
                            store.distance
                        )}
                    </p>

                    ${
                        hasBrandData
                            ? `
                                <button
                                    class="store-favorite-btn"
                                    data-brand="${store.brand}"
                                    type="button"
                                    aria-label="收藏 ${store.brand}"
                                >
                                    ${
                                        isFavorite
                                            ? "❤️ 已收藏"
                                            : "🤍 收藏"
                                    }
                                </button>
                            `
                            : ""
                    }
                </div>

                <p>
                    ${
                        store.isOpen
                            ? "🟢 營業中"
                            : "🔴 已打烊"
                    }
                </p>
            </div>
        `;
    }


    if (stores.length === 0) {
        html = `
            <p>
                目前這個距離內沒有營業中的飲料店。
            </p>
        `;
    }


    storeList.innerHTML = html;


    // 店家卡片點擊事件
    const storeCards =
        document.querySelectorAll(
            ".store-card"
        );


    for (
        let i = 0;
        i < storeCards.length;
        i++
    ) {
        storeCards[i].addEventListener(
            "click",
            function () {
                showStoreDetail(
                    stores[i]
                );
            }
        );
    }


    // 列表收藏按鈕
    const favoriteButtons =
        document.querySelectorAll(
            ".store-favorite-btn"
        );


    for (
        let i = 0;
        i < favoriteButtons.length;
        i++
    ) {
        favoriteButtons[i].addEventListener(
            "click",
            function (event) {
                // 不要同時觸發店家卡片
                event.stopPropagation();

                const brandName =
                    favoriteButtons[i]
                        .dataset
                        .brand;

                toggleFavoriteBrand(
                    brandName
                );

                renderFavoriteBrands();
                updateStoreList();
            }
        );
    }
}


// 依照目前距離更新列表
function updateStoreList() {
    const openStores =
        getOpenStores(
            currentDistance
        );

    renderStoreCount(openStores);
    renderStores(openStores);
}


// ======================
// 收藏品牌區域
// ======================


function renderFavoriteBrands() {
    favoriteBrandList.innerHTML = "";

    const favoriteBrandData =
        drinkBrands.filter(
            brand =>
                favoriteBrands.includes(
                    brand.name
                )
        );


    for (
        let i = 0;
        i < favoriteBrandData.length;
        i++
    ) {
        const brand =
            favoriteBrandData[i];

        favoriteBrandList.innerHTML += `
            <button
                class="favorite-brand-item"
                type="button"
                data-brand="${brand.name}"
            >
                <img
                    src="${brand.image}"
                    alt="${brand.name}"
                    class="favorite-brand-logo"
                >

                <span class="favorite-brand-name">
                    ${brand.name}
                </span>
            </button>
        `;
    }


    const favoriteBrandButtons =
        document.querySelectorAll(
            ".favorite-brand-item"
        );


    for (
        let i = 0;
        i < favoriteBrandButtons.length;
        i++
    ) {
        favoriteBrandButtons[i]
            .addEventListener(
                "click",
                function () {
                    const brandName =
                        favoriteBrandButtons[i]
                            .dataset
                            .brand;

                    const selectedStore =
                        currentStores
                            .filter(
                                store =>
                                    store.brand ===
                                        brandName &&
                                    store.isOpen
                            )
                            .sort(
                                (a, b) =>
                                    a.distance -
                                    b.distance
                            )[0];


                    if (selectedStore) {
                        showStoreDetail(
                            selectedStore
                        );
                    } else {
                        alert(
                            `目前附近沒有營業中的 ${brandName} 店家`
                        );
                    }
                }
            );
    }
}


// ======================
// 隨機店家
// ======================


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
                <span>
                    ⭐ ${
                        store.rating > 0
                            ? store.rating
                            : "暫無評分"
                    }
                </span>

                <span>
                    📍 ${formatDistance(
                        store.distance
                    )}
                </span>
            </div>

            <div class="random-card__barcode">
            </div>
        </div>
    `;


    const randomCard =
        document.querySelector(
            ".random-card"
        );


    if (randomCard) {
        randomCard.addEventListener(
            "click",
            function () {
                showStoreDetail(store);
            }
        );
    }
}


// ======================
// 店家詳細頁
// ======================


function showStoreDetail(store) {
    // 切換頁面
    storeListPage.classList.remove(
        "page--active"
    );

    storeDetailPage.classList.add(
        "page--active"
    );


    // 回到詳細頁最上方
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });


    detailStoreName.textContent =
        store.name;


    // 尋找品牌完整資料
    const brand =
        drinkBrands.find(
            drinkBrand =>
                drinkBrand.name ===
                store.brand
        );


    let menuHtml = "";
    let toppingsHtml = "";
    let optionsHtml = "";
    let categoryButtonsHtml = "";


    // ======================
    // 產生品牌菜單資料
    // ======================

    if (brand) {

        // 飲品菜單
        for (
            let i = 0;
            i < brand.menu.length;
            i++
        ) {
            const category =
                brand.menu[i];

            const categoryId =
                `menu-category-${i}`;


            categoryButtonsHtml += `
                <button
                    class="menu-category-btn${
                        i === 0
                            ? " active"
                            : ""
                    }"
                    data-target="${categoryId}"
                    type="button"
                >
                    ${category.category}
                </button>
            `;


            menuHtml += `
                <section
                    class="menu-category"
                    id="${categoryId}"
                >
                    <div class="menu-category-title-row">
                        <h4>
                            ${category.category}
                        </h4>

                        <div class="menu-price-labels">
                            <span>M</span>
                            <span>L</span>
                        </div>
                    </div>
            `;


            for (
                let j = 0;
                j < category.drinks.length;
                j++
            ) {
                const drink =
                    category.drinks[j];

                menuHtml += `
                    <div class="menu-item">
                        <span class="menu-item-name">
                            ${drink.name}
                        </span>

                        <span class="menu-item-price">
                            <span class="menu-item-price-m">
                                ${
                                    drink.mediumPrice !== null
                                        ? drink.mediumPrice
                                        : "–"
                                }
                            </span>

                            <span class="menu-item-price-l">
                                ${
                                    drink.largePrice !== null
                                        ? drink.largePrice
                                        : "–"
                                }
                            </span>
                        </span>
                    </div>
                `;
            }


            menuHtml += `
                </section>
            `;
        }


        // 配料
        if (brand.toppings.length > 0) {
            for (
                let i = 0;
                i < brand.toppings.length;
                i++
            ) {
                const topping =
                    brand.toppings[i];

                toppingsHtml += `
                    <div class="menu-item">
                        <span>
                            ${topping.name}
                        </span>

                        <span>
                            +${topping.price}
                        </span>
                    </div>
                `;
            }
        } else {
            toppingsHtml = `
                <p>目前沒有配料資料。</p>
            `;
        }


        // 甜度
        optionsHtml += `
            <h4>甜度</h4>
        `;

        for (
            let i = 0;
            i < brand.sweetness.length;
            i++
        ) {
            optionsHtml += `
                <div class="menu-item">
                    ${brand.sweetness[i]}
                </div>
            `;
        }


        // 冰塊
        optionsHtml += `
            <h4>冰塊</h4>
        `;

        for (
            let i = 0;
            i < brand.iceLevels.length;
            i++
        ) {
            optionsHtml += `
                <div class="menu-item">
                    ${brand.iceLevels[i]}
                </div>
            `;
        }

    } else {
        menuHtml = `
            <p>
                目前沒有這個品牌的菜單資料。
            </p>
        `;
    }


    // ======================
    // 固定在上方的內容
    // ======================

    detailStoreHeader.innerHTML = `
        <div class="store-hero">

            ${
                brand
                    ? `
                        <img
                            src="${brand.image}"
                            alt="${brand.name}"
                            class="store-hero-logo"
                        >
                    `
                    : ""
            }

            <div class="store-hero-meta">
                <p class="store-hero-rating">
                    <span class="hero-meta-icon">⭐</span>
                    ${
                        store.rating > 0
                            ? store.rating
                            : "暫無評分"
                    }
                </p>

                <p class="store-hero-distance">
                    <span class="hero-meta-icon">📍</span>
                    ${formatDistance(
                        store.distance
                    )}
                </p>

                <p class="store-hero-status ${
                    store.isOpen
                        ? "is-open"
                        : "is-closed"
                }">
                    <span class="hero-meta-icon">
                        ${
                            store.isOpen
                                ? "🟢"
                                : "🔴"
                        }
                    </span>
                    ${
                        store.isOpen
                            ? "營業中"
                            : "已打烊"
                    }
                </p>
            </div>

            <div class="store-hero-actions">

                <a
                    href="${
                        store.googleMapsUrl ||
                        `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`
                    }"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="store-hero-icon-btn store-hero-map-btn"
                    aria-label="在 Google Maps 開啟"
                >
                    🗺️
                </a>

                ${
                    brand
                        ? `
                            <button
                                id="favorite-btn"
                                class="store-hero-icon-btn"
                                type="button"
                                aria-label="收藏品牌"
                            >
                                ☆
                            </button>
                        `
                        : ""
                }

            </div>
        </div>


        ${
            brand
                ? `
                    <h3 class="store-menu-heading">
                        🧋 ${brand.name} 菜單
                    </h3>

                    <div class="menu-tabs">
                        <button
                            class="menu-tab-btn active"
                            data-tab="drinks"
                            type="button"
                        >
                            飲品
                        </button>

                        <button
                            class="menu-tab-btn"
                            data-tab="toppings"
                            type="button"
                        >
                            配料
                        </button>

                        <button
                            class="menu-tab-btn"
                            data-tab="options"
                            type="button"
                        >
                            甜度冰塊
                        </button>
                    </div>

                    <div class="menu-category-buttons">
                        ${categoryButtonsHtml}
                    </div>
                `
                : ""
        }
    `;


    // ======================
    // 下方可捲動的內容
    // ======================

    detailStoreInfo.innerHTML = `
        <div
            id="drinks-tab"
            class="menu-tab-content"
        >
            ${menuHtml}
        </div>

        ${
            brand
                ? `
                    <div
                        id="toppings-tab"
                        class="menu-tab-content"
                        hidden
                    >
                        ${toppingsHtml}
                    </div>

                    <div
                        id="options-tab"
                        class="menu-tab-content"
                        hidden
                    >
                        ${optionsHtml}
                    </div>
                `
                : ""
        }
    `;


    // 沒有品牌資料時，不執行菜單事件
    if (!brand) {
        return;
    }


    // ======================
    // 主分頁按鈕
    // ======================
    
    
    const menuTabButtons =
        detailStoreHeader.querySelectorAll(
            ".menu-tab-btn"
        );

    const menuTabContents =
        detailStoreInfo.querySelectorAll(
            ".menu-tab-content"
        );

    const menuCategoryButtons =
        detailStoreHeader.querySelector(
            ".menu-category-buttons"
        );


    for (
        let i = 0;
        i < menuTabButtons.length;
        i++
    ) {
        menuTabButtons[i].addEventListener(
            "click",
            function () {
                const selectedTab =
                    menuTabButtons[i]
                        .dataset
                        .tab;


                // 全部內容隱藏
                for (
                    let j = 0;
                    j < menuTabContents.length;
                    j++
                ) {
                    menuTabContents[j].hidden =
                        true;
                }


                // 全部按鈕取消 active
                for (
                    let j = 0;
                    j < menuTabButtons.length;
                    j++
                ) {
                    menuTabButtons[j]
                        .classList
                        .remove("active");
                }


                const selectedContent =
                    document.getElementById(
                        `${selectedTab}-tab`
                    );


                if (selectedContent) {
                    selectedContent.hidden =
                        false;
                }


                menuTabButtons[i]
                    .classList
                    .add("active");


                // 分類按鈕只在飲品分頁顯示
                if (menuCategoryButtons) {
                    if (selectedTab === "drinks") {
                        menuCategoryButtons.style.display = "flex";
                    } else {
                        menuCategoryButtons.style.display = "none";
                    }
                }
            }
        );
    }


    // ======================
    // 菜單分類跳轉
    // ======================

    const categoryButtons =
        detailStoreHeader.querySelectorAll(
            ".menu-category-btn"
        );


    for (
        let i = 0;
        i < categoryButtons.length;
        i++
    ) {
        categoryButtons[i].addEventListener(
            "click",
            function () {
                for (
                    let j = 0;
                    j < categoryButtons.length;
                    j++
                ) {
                    categoryButtons[j]
                        .classList
                        .remove("active");
                }

                categoryButtons[i]
                    .classList
                    .add("active");


                const targetId =
                    categoryButtons[i]
                        .dataset
                        .target;

                const targetCategory =
                    document.getElementById(
                        targetId
                    );


                if (targetCategory) {
                    targetCategory.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        );
    }


    // ======================
    // 詳細頁收藏按鈕
    // ======================

    const favoriteBtn =
        document.getElementById(
            "favorite-btn"
        );


    if (favoriteBtn) {
        let isFavorite =
            favoriteBrands.includes(
                brand.name
            );


        updateFavoriteButton(
            favoriteBtn,
            isFavorite
        );


        favoriteBtn.addEventListener(
            "click",
            function () {
                toggleFavoriteBrand(
                    brand.name
                );

                isFavorite =
                    favoriteBrands.includes(
                        brand.name
                    );


                updateFavoriteButton(
                    favoriteBtn,
                    isFavorite
                );


                renderFavoriteBrands();
            }
        );
    }
}


// ======================
// 事件監聽
// ======================


// 隨機選一家店
storeRandomBtn.addEventListener(
    "click",
    function () {
        const openStores =
            getOpenStores(
                currentDistance
            );


        if (openStores.length === 0) {
            alert(
                "目前沒有符合條件的營業中店家"
            );

            return;
        }


        const randomIndex =
            Math.floor(
                Math.random() *
                openStores.length
            );


        const randomStore =
            openStores[randomIndex];


        renderRandomStore(
            randomStore
        );
    }
);


// 距離篩選按鈕
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

                randomResult.innerHTML =
                    "";
            }
        );
    }
);


// 返回店家列表
backBtn.addEventListener(
    "click",
    function () {
        storeListPage.classList.add(
            "page--active"
        );

        storeDetailPage.classList.remove(
            "page--active"
        );

        detailStoreHeader.innerHTML =
            "";

        detailStoreInfo.innerHTML =
            "";
    }
);


// ======================
// Google Maps
// ======================


async function initGoogleMaps() {
    console.log(
        "Google Maps API 載入成功！"
    );


    storeCount.textContent =
        "正在取得你的位置...";

    storeList.innerHTML = `
        <p>
            請稍候，正在搜尋附近飲料店。
        </p>
    `;


    if (
        !("geolocation" in navigator)
    ) {
        storeCount.textContent =
            "你的瀏覽器不支援定位功能";

        storeList.innerHTML = `
            <p>
                請使用支援定位功能的瀏覽器。
            </p>
        `;

        return;
    }


    navigator.geolocation.getCurrentPosition(

        async function (position) {
            try {
                console.log(
                    "定位成功！"
                );


                const userLocation = {
                    lat:
                        position.coords
                            .latitude,

                    lng:
                        position.coords
                            .longitude
                };


                const {
                    Place,
                    SearchNearbyRankPreference
                } =
                    await google.maps
                        .importLibrary(
                            "places"
                        );


                const request = {
                    fields: [
                        "displayName",
                        "location",
                        "rating",
                        "googleMapsURI"
                    ],

                    locationRestriction: {
                        center:
                            userLocation,

                        radius: 1000
                    },

                    includedPrimaryTypes: [
                        "tea_house"
                    ],

                    maxResultCount: 20,

                    rankPreference:
                        SearchNearbyRankPreference
                            .DISTANCE
                };


                const { places } =
                    await Place.searchNearby(
                        request
                    );


                const googleStores =
                    places.map(
                        function (place) {

                            const storeLatitude =
                                place.location
                                    .lat();

                            const storeLongitude =
                                place.location
                                    .lng();


                            return {
                                name:
                                    place.displayName,

                                brand:
                                    getBrandFromStoreName(
                                        place.displayName
                                    ),

                                latitude:
                                    storeLatitude,

                                longitude:
                                    storeLongitude,

                                distance:
                                    calculateDistance(
                                        userLocation.lat,
                                        userLocation.lng,
                                        storeLatitude,
                                        storeLongitude
                                    ),

                                rating:
                                    place.rating ??
                                    0,

                                // 目前尚未要求營業時間欄位
                                isOpen: true,

                                googleMapsUrl:
                                    place.googleMapsURI
                            };
                        }
                    );


                console.table(
                    googleStores
                );


                currentStores =
                    googleStores;


                updateStoreList();
                renderFavoriteBrands();

            } catch (error) {
                console.error(
                    "搜尋店家失敗：",
                    error
                );

                storeCount.textContent =
                    "搜尋附近店家時發生錯誤";

                storeList.innerHTML = `
                    <p>
                        無法載入附近店家，
                        請稍後重新整理。
                    </p>
                `;
            }
        },


        function (error) {
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
    );
}


// ======================
// 初始化
// ======================

storeCount.textContent =
    "正在載入 Google Maps...";

storeList.innerHTML = `
    <p>
        請稍候，正在準備附近店家資料。
    </p>
`;

renderFavoriteBrands();