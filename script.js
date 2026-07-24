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
    longitude: 121.465,
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
    isOpen: false
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
// 全部店家按鈕
const storeAllBtn = document.getElementById("store-all-btn");
// 營業中按鈕
const storeOpenBtn = document.getElementById("store-open-btn");

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
                <p>${store.isOpen ? "🟢 營業中" : "🔴 已打烊"}</p>
            </div>
        `; 
    }

    storeList.innerHTML = html; 

}

function renderStoreCount(stores) {
    storeCount.textContent = `目前共有 ${stores.length} 間飲料店`;
}

// ======================
// 初始化畫面
// ======================

// 顯示飲料店數量
renderStoreCount(drinkStores);

// 顯示飲料店
renderStores(drinkStores);

storeAllBtn.addEventListener("click", function () {
    renderStoreCount(drinkStores);
    renderStores(drinkStores);
});

storeOpenBtn.addEventListener("click", function () {
    const openStores = drinkStores.filter(store => store.isOpen);
    renderStoreCount(openStores);
    renderStores(openStores);
});