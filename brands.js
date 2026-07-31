const drinkBrands = [
    {
        name: "CoCo都可",
        keywords: ["coco", "coco都可"],
        image: "images/brands/CoCo.png",
        menu: [
            "百香雙響炮 35元",
            "珍珠奶茶 30元",
            "四季春青茶 25元"
        ]
    },
    {
        name: "50嵐",
        keywords: [
            "50嵐",
            "50 Lan",
            "50lan"
        ],
        image: "images/brands/50lan.png",
        menu: [
            {
                category: "找好茶",
                drinks: [
                    { name: "茉莉綠茶", mediumPrice: 35, largePrice: 40 },
                    { name: "阿薩姆紅茶", mediumPrice: 35, largePrice: 40 },
                    { name: "四季春青茶", mediumPrice: 35, largePrice: 40 },
                    { name: "黃金烏龍", mediumPrice: 35, largePrice: 40 },
                    { name: "檸檬綠", mediumPrice: 50, largePrice: 60 },
                    { name: "梅の綠", mediumPrice: 50, largePrice: 60 },
                    { name: "桔子綠", mediumPrice: 50, largePrice: 60 },
                    { name: "8冰茶", mediumPrice: 50, largePrice: 60 },
                    { name: "養樂多綠◆", mediumPrice: 50, largePrice: 60 },
                    { name: "旺來紅", mediumPrice: 50, largePrice: 60 },
                    { name: "柚子紅", mediumPrice: 50, largePrice: 60 },
                    { name: "鮮柚綠◆", mediumPrice: 60, largePrice: 75 }
                ]
            },
            {
                category: "找口感",
                drinks: [
                    { name: "四季春+珍波椰", mediumPrice: 40, largePrice: 50 },
                    { name: "波霸紅/綠/青/烏", mediumPrice: 40, largePrice: 50 },
                    { name: "波霸奶茶", mediumPrice: 50, largePrice: 60 },
                    { name: "波霸奶綠", mediumPrice: 50, largePrice: 60 },
                    { name: "波霸烏龍奶茶", mediumPrice: 50, largePrice: 60 },
                    { name: "珍珠紅/綠/青/烏", mediumPrice: 40, largePrice: 50 },
                    { name: "珍珠奶茶", mediumPrice: 50, largePrice: 60 },
                    { name: "珍珠奶綠", mediumPrice: 50, largePrice: 60 },
                    { name: "椰果奶茶", mediumPrice: 50, largePrice: 60 },
                    { name: "布丁奶茶/奶綠", mediumPrice: 60, largePrice: 75 },
                    { name: "布丁紅/綠/青/烏", mediumPrice: 50, largePrice: 60 }
                ]
            },
            {
                category: "找奶茶",
                drinks: [
                    { name: "奶茶", mediumPrice: 50, largePrice: 60 },
                    { name: "奶綠", mediumPrice: 50, largePrice: 60 },
                    { name: "紅茶瑪奇朵", mediumPrice: 50, largePrice: 60 },
                    { name: "烏龍瑪奇朵", mediumPrice: 50, largePrice: 60 },
                    { name: "四季奶青", mediumPrice: 50, largePrice: 60 },
                    { name: "黃金烏龍奶茶", mediumPrice: 50, largePrice: 60 },
                    { name: "阿華田", mediumPrice: 55, largePrice: 65 }
                ]
            },
            {
                category: "找新鮮",
                drinks: [
                    { name: "檸檬汁", mediumPrice: 55, largePrice: 65 },
                    { name: "金桔檸檬", mediumPrice: 55, largePrice: 65 },
                    { name: "檸檬梅汁", mediumPrice: 60, largePrice: 75 },
                    { name: "檸檬養樂多◆", mediumPrice: 65, largePrice: 80 },
                    { name: "8冰茶", mediumPrice: 50, largePrice: 60 },
                    { name: "柚子茶", mediumPrice: null, largePrice: 60 },
                    { name: "鮮柚汁◆", mediumPrice: 60, largePrice: 75 },
                    { name: "葡萄柚多◆", mediumPrice: 65, largePrice: 80 }
                ]
            },
            {
                category: "紅茶拿鐵",
                drinks: [
                    { name: "紅茶拿鐵", mediumPrice: 60, largePrice: 75 },
                    { name: "綠茶拿鐵", mediumPrice: 60, largePrice: 75 },
                    { name: "黃金烏龍拿鐵", mediumPrice: 60, largePrice: 75 },
                    { name: "阿華田拿鐵", mediumPrice: 65, largePrice: 80 }
                ]
            },
            {
                category: "找冰淇淋",
                drinks: [
                    { name: "冰淇淋紅茶", mediumPrice: 50, largePrice: 60 },
                    { name: "芒果青", mediumPrice: 50, largePrice: 60 },
                    { name: "荔枝烏龍", mediumPrice: 50, largePrice: 60 }
                ]
            }
        ],
        toppings: [
            { name: "珍珠", price: 10 },
            { name: "波霸", price: 10 },
            { name: "椰果", price: 10 },
            { name: "混珠", price: 10 },
            { name: "珍波椰", price: 10 },
            { name: "珍椰", price: 10 },
            { name: "波椰", price: 10 }
        ],
        sweetness: [
            "正常糖",
            "少糖",
            "半糖",
            "微糖",
            "一分糖",
            "無糖"
        ],
        iceLevels: [
            "正常冰",
            "少冰",
            "微冰",
            "去冰",
            "完全去冰",
            "溫",
            "熱"
        ]
    },
    {
        name: "五桐號",
        keywords: ["五桐號"],
        image: "images/brands/WooTEA.png",
        menu: [
            "百香雙響炮 35元",
            "珍珠奶茶 30元",
            "四季春青茶 25元"
        ]
    },
    {
        name: "茶湯會",
        keywords: ["茶湯會"],
        image: "images/brands/P-TEA.png",
        menu: [
            "百香雙響炮 35元",
            "珍珠奶茶 30元",
            "四季春青茶 25元"
        ]
    },
];