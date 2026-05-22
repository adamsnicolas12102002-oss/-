const tabs = Array.from(document.querySelectorAll(".tab"));
const spotCards = Array.from(document.querySelectorAll(".spot-card"));
const featureLinks = Array.from(document.querySelectorAll("[data-feature-filter]"));
const cityToggle = document.querySelector("[data-city-toggle]");
const shareButton = document.querySelector(".share-btn");
const soundButton = document.querySelector("[data-sound]");
const planTabs = Array.from(document.querySelectorAll(".plan-tab"));
const generateButton = document.querySelector("[data-generate-plan]");

const cities = ["大理", "重庆", "瑞士", "三亚"];
let cityIndex = 0;

const plans = {
  dali: {
    name: "大理双廊 · 洱海蓝调路线",
    desc: "适合第一次去大理、想拍海景和古镇氛围的人，行程节奏轻，机位集中。",
    light: "清晨逆光、傍晚蓝调",
    outfit: "白裙、针织、草编包",
    focus: "留白、低机位、慢动作",
    days: [
      {
        time: "Day 1 · 09:30",
        title: "龙龛码头逆光散步",
        text: "浅色上衣、草编包，人物放在右侧三分线，海面留出大面积天空。",
        meta: "机位：码头木栈道侧边 | 色卡：奶白、湖蓝、浅绿",
      },
      {
        time: "Day 2 · 15:40",
        title: "喜洲古镇巷口慢门",
        text: "避开正午顶光，用白墙和门框做干净背景，拍走路、回头、扶帽子。",
        meta: "机位：转角墙面 | 色卡：棉麻白、木色、砖红",
      },
      {
        time: "Day 3 · 18:50",
        title: "双廊蓝调海景",
        text: "手机开网格线，人物站近镜头，远处湖面和船做背景层次。",
        meta: "机位：临海露台 | 色卡：灰蓝、米白、墨绿",
      },
    ],
    shots: ["广角拍大场景，2x 镜头拍半身人像。", "每个机位先拍空景，再让人物进入画面。", "同一场景保留横图、竖图和封面图各一张。"],
    avoids: ["不要把全部行程塞满，出片路线需要等光线。", "古镇商业街背景杂，优先找墙面、门洞和树影。", "海边风大，准备发夹、披肩和防晒。"],
  },
  city: {
    name: "重庆黄桷坪 · 老街街拍路线",
    desc: "适合喜欢复古、涂鸦、城市层次的人，路线以步行为主，夜景可接洪崖洞。",
    light: "阴天柔光、蓝调夜景",
    outfit: "牛仔、皮衣、黑白对比",
    focus: "招牌、涂鸦、路人动线",
    days: [
      {
        time: "Day 1 · 10:20",
        title: "黄桷坪涂鸦街",
        text: "选低饱和墙面做背景，人物不要贴墙，留一段距离更有层次。",
        meta: "机位：街角斜拍 | 色卡：水泥灰、墨绿、砖红",
      },
      {
        time: "Day 2 · 16:30",
        title: "交通茶馆窗边",
        text: "用窗光拍侧脸，桌面茶杯做前景，画面更像电影截图。",
        meta: "机位：窗边靠内侧 | 色卡：木色、茶褐、米白",
      },
      {
        time: "Day 3 · 19:10",
        title: "江边蓝调夜景",
        text: "等天空未全黑时拍，保留建筑轮廓和灯光层次。",
        meta: "机位：江对岸斜角 | 色卡：霓虹橙、深蓝、黑",
      },
    ],
    shots: ["街拍优先连拍走路动作。", "利用斑马线、橱窗和路灯做构图线。", "夜景降低曝光，避免灯牌过曝。"],
    avoids: ["热门点人多，构图尽量拍半身和局部。", "涂鸦墙颜色杂，穿搭控制在 2 个主色内。", "夜景别太晚，蓝调时刻最稳。"],
  },
  coast: {
    name: "三亚海边 · 日落度假路线",
    desc: "适合想拍白裙、海风、椰林和日落的人，重点是轻行程和黄金光线。",
    light: "日落前 1 小时",
    outfit: "白裙、草帽、薄衬衫",
    focus: "海浪、椰影、背影",
    days: [
      {
        time: "Day 1 · 08:40",
        title: "椰林光斑人像",
        text: "站在树影边缘，人物面对海风，拍回头和整理头发的动作。",
        meta: "机位：椰林外侧 | 色卡：椰绿、奶白、沙色",
      },
      {
        time: "Day 2 · 17:30",
        title: "沙滩日落奔跑",
        text: "快门开连拍，人物从画面一侧跑向另一侧，留出太阳和海浪。",
        meta: "机位：低机位贴近沙面 | 色卡：橘粉、浅蓝、金黄",
      },
      {
        time: "Day 3 · 10:10",
        title: "海边咖啡店窗景",
        text: "正午转室内，利用窗边和饮品做前景，避开硬光。",
        meta: "机位：窗边 45 度 | 色卡：奶油白、木色、海蓝",
      },
    ],
    shots: ["带一条可飘动的披肩或衬衫。", "海边照片多拍背影和侧身，会更自然。", "日落时先定曝光，再让人物进入画面。"],
    avoids: ["正午沙滩顶光重，适合转去咖啡店或树荫。", "海风会乱发型，提前准备发夹。", "白裙注意不要和过曝天空糊在一起。"],
  },
};

let generatedIndex = 0;

function setActiveFilter(filter) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.filter === filter;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  spotCards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const shouldShow = filter === "all" || categories.includes(filter);
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

function renderList(targetId, items) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function setPlan(planKey) {
  const plan = plans[planKey];
  if (!plan) return;

  document.getElementById("plan-name").textContent = plan.name;
  document.getElementById("plan-desc").textContent = plan.desc;
  document.getElementById("plan-light").textContent = plan.light;
  document.getElementById("plan-outfit").textContent = plan.outfit;
  document.getElementById("plan-focus").textContent = plan.focus;

  document.getElementById("plan-grid").innerHTML = plan.days
    .map(
      (day) => `
        <article>
          <span>${day.time}</span>
          <h3>${day.title}</h3>
          <p>${day.text}</p>
          <em>${day.meta}</em>
        </article>
      `
    )
    .join("");

  renderList("shot-list", plan.shots);
  renderList("avoid-list", plan.avoids);

  planTabs.forEach((tab) => {
    const isActive = tab.dataset.plan === planKey;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveFilter(tab.dataset.filter));
});

featureLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveFilter(link.dataset.featureFilter));
});

planTabs.forEach((tab) => {
  tab.addEventListener("click", () => setPlan(tab.dataset.plan));
});

if (generateButton) {
  generateButton.addEventListener("click", () => {
    const keys = Object.keys(plans);
    generatedIndex = (generatedIndex + 1) % keys.length;
    setPlan(keys[generatedIndex]);
    document.getElementById("plan").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("已生成一套出片路线");
  });
}

if (cityToggle) {
  cityToggle.addEventListener("click", () => {
    cityIndex = (cityIndex + 1) % cities.length;
    cityToggle.querySelector("span").textContent = cities[cityIndex];
  });
}

function showToast(message) {
  let toast = document.querySelector(".share-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "share-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1600);
}

if (shareButton) {
  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: document.title,
      text: "出片友好旅行指南：热门目的地、拍照机位和路线灵感。",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      showToast("链接已复制");
    } catch {
      showToast("分享暂时不可用");
    }
  });
}

if (soundButton) {
  soundButton.addEventListener("click", () => {
    const isOn = soundButton.classList.toggle("is-on");
    soundButton.setAttribute("aria-label", isOn ? "关闭氛围音" : "切换氛围音");
    showToast(isOn ? "已打开旅行氛围" : "已关闭旅行氛围");
  });
}

setActiveFilter("all");
setPlan("dali");
