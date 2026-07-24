// ======================
// 假資料
// ======================

const drinkStores = [
  {
    name: "珍珠茶坊",
    latitude: 25.085,
    longitude: 121.470,
    rating: 4.5,
    isOpen: true,
    distance: 200
  },
  {
    name: "五十嵐",
    latitude: 25.08,
    longitude: 121.48,
    rating: 4.2,
    isOpen: true,
    distance: 450
  },
  {
    name: "茶湯會",
    latitude: 25.075,
    longitude: 121.460,
    rating: 4.0,
    isOpen: true,
    distance: 800
  },
  {
    name: "CoCo都可",
    latitude: 25.070,
    longitude: 121.455,
    rating: 4.3,
    isOpen: true,
    distance: 1200
  }
];

// 在瀏覽器開發者工具中查看資料
console.table(drinkStores);



// ======================
// 取得 HTML 元素
// ======================

// 飲料店數量
const storeCount = document.getElementById("store-count");
// 顯示飲料店列表
const storeList = document.getElementById("store-list");
// 隨機店家按鈕
const storeRandomBtn = document.getElementById("store-random-btn");
// 顯示隨機店家結果
const randomResult = document.getElementById("random-result");
// 距離篩選器
const distanceFilter = document.getElementById("distance-filter");

// ======================
// function
// ======================

// 顯示飲料店列表的function
function renderStores(stores) {

let html = "";
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i]; 

        html += `
            <div class="store-card">
                <h3>${store.name}</h3>
                <p>評分: ${store.rating}</p>
                <p>距離: ${store.distance} 公尺</p>
                <p>${store.isOpen ? "🟢 營業中" : "🔴 已打烊"}</p>
            </div>
        `; 
    }

    storeList.innerHTML = html; 

}
// 顯示飲料店數量的function
function renderStoreCount(stores) {
    storeCount.textContent = `目前共有 ${stores.length} 間飲料店`;
}
// 取得營業中的飲料店並排序的function
function getOpenStores(maxDistance) {
    const openStores =
        drinkStores.filter(store => store.isOpen && store.distance <= maxDistance);

    openStores.sort(
        (a, b) => a.distance - b.distance
    );

    return openStores;
}
// 顯示隨機店家的function
function renderRandomStore(store) {
    let html = "";
    html += `
        <div class="random-card">
            <h2>🎉 今天就喝這間！</h2>
            <h3>${store.name}</h3>
            <p>⭐ ${store.rating}</p>
            <p>📍 ${store.distance} 公尺</p>
        </div>
    `; 
    randomResult.innerHTML = html; 
}

   

// ======================
// 初始化畫面
// ======================

// 取得營業中的飲料店
const openStores = getOpenStores(
    Number(distanceFilter.value)
);

// 顯示營業中的飲料店數量
renderStoreCount(openStores);

// 顯示營業中的飲料店
renderStores(openStores);

// 隨機店家按鈕
storeRandomBtn.addEventListener("click", function () {
    const openStores = getOpenStores(
    Number(distanceFilter.value)
);
    if (openStores.length === 0) {
        // 如果沒有營業中的店家，顯示提示訊息
        alert("目前沒有營業中的店家");
        return; // 提前返回，避免後續程式碼執行
    }
    const randomIndex = Math.floor(Math.random() * openStores.length);
    const randomStore = openStores[randomIndex];
    renderRandomStore(randomStore);    
});

// 距離篩選器
distanceFilter.addEventListener("change", function () {

    const openStores = getOpenStores(
        Number(distanceFilter.value)
    );
    renderStoreCount(openStores);
    renderStores(openStores);
    randomResult.innerHTML = "";
});