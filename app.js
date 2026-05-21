const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const surnameFacts = {
  王: "王姓在传统姓氏中分布广泛，也常出现在洪洞大槐树寻根叙事里。",
  李: "李姓源流悠久，家族迁徙记忆常与中原、华北多地相连。",
  张: "张姓人口众多，许多家族会把大槐树作为追问祖源的重要线索。",
  刘: "刘姓历史支脉丰富，寻根时适合结合家谱、堂号和祖籍地继续查证。",
  陈: "陈姓支派繁多，若家族口述提到山西迁徙，可把洪洞作为一条文化线索。",
  赵: "赵姓与北方历史关系深厚，寻根时可重点比对祖辈口述和地方志。",
  杨: "杨姓在山西、河南、河北等地均有深厚分布，适合沿迁徙路线继续追溯。"
};

const provinceRoutes = {
  北京: "山西洪洞 → 京畿一带",
  天津: "山西洪洞 → 海河津门",
  河北: "山西洪洞 → 河北燕赵",
  山西: "山西洪洞 → 三晋故土",
  内蒙古: "山西洪洞 → 塞上草原",
  辽宁: "山西洪洞 → 辽沈大地",
  吉林: "山西洪洞 → 白山松水",
  黑龙江: "山西洪洞 → 黑土龙江",
  上海: "山西洪洞 → 江海沪上",
  江苏: "山西洪洞 → 江苏江淮",
  浙江: "山西洪洞 → 浙江钱塘",
  安徽: "山西洪洞 → 安徽淮上",
  福建: "山西洪洞 → 八闽山海",
  江西: "山西洪洞 → 赣鄱大地",
  山东: "山西洪洞 → 山东齐鲁",
  河南: "山西洪洞 → 河南中原",
  湖北: "山西洪洞 → 荆楚大地",
  湖南: "山西洪洞 → 三湘四水",
  广东: "山西洪洞 → 岭南广东",
  广西: "山西洪洞 → 八桂广西",
  海南: "山西洪洞 → 琼州海岛",
  重庆: "山西洪洞 → 巴渝山城",
  四川: "山西洪洞 → 天府四川",
  贵州: "山西洪洞 → 黔中山地",
  云南: "山西洪洞 → 云岭云南",
  西藏: "山西洪洞 → 雪域高原",
  陕西: "山西洪洞 → 陕西关中",
  甘肃: "山西洪洞 → 陇原甘肃",
  青海: "山西洪洞 → 河湟青海",
  宁夏: "山西洪洞 → 塞上宁夏",
  新疆: "山西洪洞 → 天山南北",
  香港: "山西洪洞 → 香江香港",
  澳门: "山西洪洞 → 濠江澳门",
  台湾: "山西洪洞 → 宝岛台湾"
};

const rootForm = document.querySelector("#rootForm");
const surnameInput = document.querySelector("#surnameInput");
const provinceSelect = document.querySelector("#provinceSelect");
const resultCard = document.querySelector("#resultCard");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const routeChip = document.querySelector("#routeChip");
const posterBtn = document.querySelector("#posterBtn");
const shareBtn = document.querySelector("#shareBtn");
const shareStatus = document.querySelector("#shareStatus");
const shareCopy = document.querySelector("#shareCopy");

function getCleanSurname() {
  return surnameInput.value.trim().replace(/\s+/g, "").slice(0, 2) || "你";
}

function buildRootCard() {
  const surname = getCleanSurname();
  const province = provinceSelect.value;
  const key = surname.length === 1 ? surname : surname[0];
  const fact = surnameFacts[key] || `${surname}姓的迁徙故事，可能藏在家谱、祖辈口述和地方志里。`;
  const route = provinceRoutes[province] || "山西洪洞 → 中原大地";

  resultTitle.textContent = `${surname}姓寻根卡`;
  resultText.textContent = `${fact} 你的祖先可能曾从大槐树下启程，也可能沿着${route.replace("山西洪洞 → ", "")}的方向，把故乡记忆带到新的家园。`;
  routeChip.textContent = route;
  resultCard.classList.add("is-generated");
  shareStatus.textContent = "";
  shareCopy.hidden = true;
}

function getSharePayload() {
  buildRootCard();

  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set("surname", getCleanSurname());
  shareUrl.searchParams.set("province", provinceSelect.value);
  shareUrl.hash = "roots";

  const title = resultTitle.textContent;
  const text = `${resultText.textContent}\n迁徙线索：${routeChip.textContent}`;
  const url = shareUrl.toString();

  return {
    shareData: {
      title,
      text,
      url
    },
    fallbackText: `${title}\n${text}\n打开同一张卡：${url}`
  };
}

function setShareStatus(message) {
  shareStatus.textContent = message;
}

function showManualShare(text) {
  shareCopy.hidden = false;
  shareCopy.value = text;
  shareCopy.focus();
  shareCopy.select();
  shareCopy.setSelectionRange(0, text.length);
  setShareStatus("文案已选中，可手动复制");
}

async function copyShareText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Continue with the selection-based fallback below.
    }
  }

  const copyTarget = document.createElement("textarea");
  copyTarget.value = text;
  copyTarget.readOnly = true;
  copyTarget.style.position = "fixed";
  copyTarget.style.top = "-1000px";
  copyTarget.style.left = "-1000px";
  copyTarget.style.opacity = "0";
  document.body.appendChild(copyTarget);
  copyTarget.focus();
  copyTarget.select();
  copyTarget.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    copyTarget.remove();
  }
}

function restoreSharedCard() {
  const params = new URLSearchParams(window.location.search);
  const surname = params.get("surname");
  const province = params.get("province");

  if (!surname && !province) return;

  if (surname) {
    surnameInput.value = surname.replace(/\s+/g, "").slice(0, 2);
  }

  if (province && provinceRoutes[province]) {
    provinceSelect.value = province;
  }

  buildRootCard();

  if (window.location.hash === "#roots") {
    requestAnimationFrame(() => {
      document.querySelector("#roots")?.scrollIntoView({ block: "start" });
    });
  }
}

rootForm.addEventListener("submit", (event) => {
  event.preventDefault();
  buildRootCard();
  resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
});

posterBtn.addEventListener("click", () => {
  buildRootCard();
  resultCard.classList.toggle("is-poster");
  posterBtn.textContent = resultCard.classList.contains("is-poster") ? "已生成" : "生成寻根卡";
});

shareBtn.addEventListener("click", async () => {
  const { shareData, fallbackText } = getSharePayload();
  shareBtn.disabled = true;
  shareBtn.textContent = "正在分享";

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      setShareStatus("已打开系统分享");
      return;
    }

    const copied = await copyShareText(fallbackText);
    if (copied) {
      setShareStatus("文案和链接已复制");
    } else {
      showManualShare(fallbackText);
    }
  } catch {
    const copied = await copyShareText(fallbackText);
    if (copied) {
      setShareStatus("文案和链接已复制");
    } else {
      showManualShare(fallbackText);
    }
  } finally {
    shareBtn.disabled = false;
    shareBtn.textContent = "分享给家人";
  }
});

restoreSharedCard();

const guideAudio = document.querySelector("#guideAudio");
const audioButtons = document.querySelectorAll(".audio-btn");

audioButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const src = button.dataset.audio;
    const active = button.classList.contains("is-playing");

    audioButtons.forEach((item) => {
      item.classList.remove("is-playing");
      item.textContent = "语音导览";
    });

    if (active) {
      guideAudio.pause();
      return;
    }

    guideAudio.src = src;
    try {
      await guideAudio.play();
      button.classList.add("is-playing");
      button.textContent = "暂停导览";
    } catch {
      button.textContent = "点击重试";
    }
  });
});

guideAudio.addEventListener("ended", () => {
  audioButtons.forEach((button) => {
    button.classList.remove("is-playing");
    button.textContent = "语音导览";
  });
});

const stampButtons = document.querySelectorAll(".stamp-btn");
const stampCount = document.querySelector("#stampCount");
const resetStamps = document.querySelector("#resetStamps");
let stamps = new Set(JSON.parse(localStorage.getItem("dahuaishu-stamps") || "[]"));

function renderStamps() {
  stampButtons.forEach((button) => {
    const stamped = stamps.has(button.dataset.stamp);
    button.classList.toggle("is-stamped", stamped);
    button.textContent = stamped ? "已盖章" : "电子盖章";
  });
  stampCount.textContent = `电子印章 ${stamps.size}/${stampButtons.length}`;
  localStorage.setItem("dahuaishu-stamps", JSON.stringify([...stamps]));
}

stampButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const stamp = button.dataset.stamp;
    if (stamps.has(stamp)) {
      stamps.delete(stamp);
    } else {
      stamps.add(stamp);
    }
    renderStamps();
  });
});

resetStamps.addEventListener("click", () => {
  stamps.clear();
  renderStamps();
});

renderStamps();

const speakBtn = document.querySelector("#speakBtn");
const summary = document.querySelector(".speakable-summary");

speakBtn.addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    speakBtn.textContent = "当前浏览器不支持";
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(summary.textContent);
  utterance.lang = "zh-CN";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
  speakBtn.textContent = "正在朗读";
  utterance.onend = () => {
    speakBtn.textContent = "朗读摘要";
  };
});

const favoriteBtn = document.querySelector("#favoriteBtn");
favoriteBtn.addEventListener("click", () => {
  localStorage.setItem("dahuaishu-favorite", "true");
  favoriteBtn.textContent = "已收藏";
});

if (localStorage.getItem("dahuaishu-favorite") === "true") {
  favoriteBtn.textContent = "已收藏";
}
