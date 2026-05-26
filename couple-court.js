const crimes = [
  {
    id: "read",
    icon: "信",
    name: "已读不回罪",
    roast: "消息已送达，但爱情未回复。",
    heading: "关于“情侣冷战纠纷案”判决如下：",
    main: "罚没收游戏机使用权 48 小时，并主动汇报今日行程。",
    extra: "今晚必须主动抱抱，并补发 3 条不敷衍的夸夸。",
    probation: "若 10 分钟内主动亲亲并解释原因，可减刑一半。"
  },
  {
    id: "snark",
    icon: "阴",
    name: "阴阳怪气罪",
    roast: "表面说没事，语气全是证据。",
    heading: "关于“情侣语气争议案”判决如下：",
    main: "罚连续 2 天使用温柔语气，不得出现“呵呵”“随便”。",
    extra: "主动提供一次情绪价值修复服务，时长不得低于 30 分钟。",
    probation: "若能准确复述原告委屈点，可当场减刑。"
  },
  {
    id: "anniversary",
    icon: "纪",
    name: "忘记纪念日罪",
    roast: "日历很满，脑子很空。",
    heading: "关于“恋爱纪念日遗忘案”判决如下：",
    main: "罚补办纪念日晚餐一次，餐后甜品由原告指定。",
    extra: "将重要日期写入手机日历，并设置三次提醒。",
    probation: "若准备手写小卡片一张，可免除朋友圈公开道歉。"
  },
  {
    id: "snack",
    icon: "食",
    name: "偷吃零食罪",
    roast: "吃的是布丁，碎的是信任。",
    heading: "关于“情侣零食纠纷案”判决如下：",
    main: "罚连续 3 天主动买奶茶，并上交第一口选择权。",
    extra: "立即补齐同款零食两份，原告享有优先挑选权。",
    probation: "若主动亲亲并写 20 字悔过小作文，可减刑一半。"
  },
  {
    id: "cold",
    icon: "哄",
    name: "冷战不哄罪",
    roast: "沉默不是金，是扣分项。",
    heading: "关于“情侣冷战处理不当案”判决如下：",
    main: "罚今晚主动破冰，不得以“我也不知道说啥”抗辩。",
    extra: "提供全糖奶茶一杯，并附赠认真拥抱一次。",
    probation: "若主动说出“我来哄你了”，本院酌情从轻处罚。"
  },
  {
    id: "game",
    icon: "游",
    name: "游戏入魔罪",
    roast: "说打完这把，结果爱情掉线。",
    heading: "关于“游戏时间管理失控案”判决如下：",
    main: "罚暂停排位 24 小时，陪原告完成一次约会任务。",
    extra: "每局结束必须回复消息，不得假装网络延迟。",
    probation: "若主动带原告上分，可申请二审。"
  }
];

const severityLabels = ["轻微撒娇", "有点委屈", "需要哄", "严重扣分", "准备分手"];
const loadingLines = [
  "正在核实聊天记录...",
  "正在调取恋爱监控...",
  "正在评估求生欲等级...",
  "正在翻阅零食库存证据...",
  "正在盖下最终红章..."
];

const state = {
  crime: crimes[3],
  plaintiff: "宝宝",
  defendant: "对象",
  trigger: "偷吃了我最后一块布丁",
  sentenceRequest: "罚被告带我去吃饭，并主动买单。",
  severity: 3
};

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

const screens = {
  home: document.querySelector("#homeScreen"),
  form: document.querySelector("#formScreen"),
  loading: document.querySelector("#loadingScreen"),
  verdict: document.querySelector("#verdictScreen")
};

const crimeGrid = document.querySelector("#crimeGrid");
const triggerText = document.querySelector("#triggerText");
const triggerCount = document.querySelector("#triggerCount");
const sentenceRequest = document.querySelector("#sentenceRequest");
const sentenceCount = document.querySelector("#sentenceCount");
const severityRange = document.querySelector("#severityRange");
const severityLabel = document.querySelector("#severityLabel");
const progressBar = document.querySelector("#progressBar");
const progressNumber = document.querySelector("#progressNumber");
const loadingText = document.querySelector("#loadingText");
const toast = document.querySelector("#toast");
const posterModal = document.querySelector("#posterModal");
const posterPreviewImg = document.querySelector("#posterPreviewImg");
const savePosterBtn = document.querySelector("#savePosterBtn");
const copyPosterBtn = document.querySelector("#copyPosterBtn");
let toastTimer;
let posterDataUrl = "";

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCrimes() {
  crimeGrid.innerHTML = crimes
    .map((crime) => {
      const selected = crime.id === state.crime.id ? " is-selected" : "";
      return `
        <button class="crime-option${selected}" type="button" data-crime="${crime.id}">
          <i>${crime.icon}</i>
          <span><b>${crime.name}</b><small>${crime.roast}</small></span>
        </button>
      `;
    })
    .join("");
}

function collectForm() {
  state.plaintiff = document.querySelector("#plaintiffName").value.trim() || "宝宝";
  state.defendant = document.querySelector("#defendantName").value.trim() || "对象";
  state.trigger = triggerText.value.trim() || "说打完这把就睡";
  state.sentenceRequest = sentenceRequest.value.trim() || state.crime.main;
  state.severity = Number(severityRange.value);
}

function renderVerdict() {
  const date = new Date();
  const caseNo = `${date.getFullYear()}-LA-${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const severityTail = state.severity >= 4 ? "本院认为情节较重，建议立即执行求和解措施。" : "本院认为仍有调解空间，建议以抱抱优先。";

  document.querySelector("#caseNo").textContent = `案号：${caseNo}`;
  document.querySelector("#resultPlaintiff").textContent = state.plaintiff;
  document.querySelector("#resultDefendant").textContent = state.defendant;
  document.querySelector("#resultCrime").textContent = state.crime.name;
  document.querySelector("#resultTrigger").textContent = state.trigger;
  document.querySelector("#verdictHeading").textContent = state.crime.heading;
  document.querySelector("#crimeNameInline").textContent = state.crime.name;
  document.querySelector("#mainSentence").textContent = state.sentenceRequest;
  document.querySelector("#extraSentence").textContent = state.crime.extra;
  document.querySelector("#probationSentence").textContent = `${state.crime.probation}${severityTail}`;
  document.querySelector("#verdictDate").textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  document.querySelector("#posterCrime").textContent = `${state.defendant}因${state.crime.name}，被判${state.sentenceRequest.replace(/^罚被告/, "")}`;

  const stamp = document.querySelector("#finalStamp");
  stamp.classList.remove("is-hit");
  requestAnimationFrame(() => stamp.classList.add("is-hit"));
}

function runLoading() {
  showScreen("loading");
  progressBar.style.width = "0%";
  progressNumber.textContent = "0";
  let progress = 0;

  const timer = window.setInterval(() => {
    progress += Math.floor(Math.random() * 13) + 8;
    if (progress >= 100) {
      progress = 100;
      window.clearInterval(timer);
      collectForm();
      renderVerdict();
      window.setTimeout(() => showScreen("verdict"), 420);
    }

    const lineIndex = Math.min(loadingLines.length - 1, Math.floor((progress / 100) * loadingLines.length));
    loadingText.textContent = loadingLines[lineIndex];
    progressBar.style.width = `${progress}%`;
    progressNumber.textContent = progress;
  }, 280);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function buildShareText() {
  return [
    "家人们谁懂啊，今天正式开庭了。",
    `案件：${state.plaintiff} 起诉 ${state.defendant}`,
    `罪名：${state.crime.name}`,
    `判决：${state.sentenceRequest}`,
    "恋爱法庭终于还我公道。"
  ].join("\n");
}

function buildQrTemplate() {
  return `
    <div class="qr-block" aria-label="二维码占位">
      <span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span>
    </div>
  `;
}

function createPosterStage() {
  const stage = document.createElement("section");
  stage.className = "poster-card poster-export-stage";
  const judgement = document.querySelector("#judgementCard").cloneNode(true);
  judgement.hidden = false;
  judgement.removeAttribute("id");
  judgement.querySelectorAll("[id]").forEach((item) => item.removeAttribute("id"));
  stage.innerHTML = `<p class="poster-slogan">家人们谁懂啊，今天正式开庭了！</p>`;
  stage.appendChild(judgement);
  stage.insertAdjacentHTML(
    "beforeend",
    `
      <div class="poster-save-footer">
        ${buildQrTemplate()}
        <p>扫码即可起诉你的另一半</p>
        <strong>给吵架一个台阶下</strong>
      </div>
    `
  );
  document.body.appendChild(stage);
  return stage;
}

function openPosterModal(dataUrl) {
  posterDataUrl = dataUrl;
  posterPreviewImg.src = dataUrl;
  posterModal.hidden = false;
}

function closePosterModal() {
  posterModal.hidden = true;
}

async function copyPosterCopy() {
  const text = buildShareText();
  try {
    await navigator.clipboard.writeText(text);
    showToast("朋友圈文案已复制");
  } catch (error) {
    console.warn("clipboard failed", error);
    showToast("复制失败了，长按后手动复制也行");
  }
}

async function savePosterImage() {
  if (!posterDataUrl) {
    showToast("请先生成海报");
    return;
  }

  const link = document.createElement("a");
  link.href = posterDataUrl;
  link.download = `情侣法庭海报-${Date.now()}.png`;
  link.click();
  showToast("海报已开始下载");
}

async function shareToMoments() {
  let stage;
  try {
    if (typeof html2canvas !== "function") {
      showToast("海报功能还没加载好，请稍后再试");
      return;
    }

    collectForm();
    renderVerdict();

    stage = createPosterStage();
    await document.fonts?.ready;
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    const canvas = await html2canvas(stage, {
      backgroundColor: "#fff7ec",
      scale: Math.min(2.5, window.devicePixelRatio || 2),
      useCORS: true,
      allowTaint: false,
      logging: false
    });
    const dataUrl = canvas.toDataURL("image/png");
    openPosterModal(dataUrl);
    showToast("海报已生成，长按图片可保存");
  } catch (error) {
    console.warn("poster generation failed", error);
    showToast("海报生成失败了，稍后再试");
  } finally {
    stage?.remove();
  }
}

function bindEvents() {
  document.querySelector("#startBtn").addEventListener("click", () => showScreen("form"));

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.go));
  });

  crimeGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-crime]");
    if (!button) return;
    state.crime = crimes.find((crime) => crime.id === button.dataset.crime) || crimes[0];
    renderCrimes();
  });

  triggerText.addEventListener("input", () => {
    triggerCount.textContent = triggerText.value.length;
  });

  sentenceRequest.addEventListener("input", () => {
    sentenceCount.textContent = sentenceRequest.value.length;
  });

  document.querySelectorAll("[data-sentence]").forEach((button) => {
    button.addEventListener("click", () => {
      sentenceRequest.value = button.dataset.sentence;
      sentenceCount.textContent = sentenceRequest.value.length;
    });
  });

  severityRange.addEventListener("input", () => {
    const value = Number(severityRange.value);
    severityLabel.textContent = severityLabels[value - 1];
    document.documentElement.style.setProperty("--severity-alpha", String(value / 8));
  });

  document.querySelector("#caseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    runLoading();
  });

  document.querySelector("#posterBtn").addEventListener("click", () => {
    const judgement = document.querySelector("#judgementCard");
    const poster = document.querySelector("#posterCard");
    const showingPoster = poster.hidden;
    poster.hidden = !showingPoster;
    judgement.hidden = showingPoster;
  });

  document.querySelector("#sendBtn").addEventListener("click", () => {
    showToast("判决书已准备好：发给 TA，给吵架一个台阶下。");
  });

  document.querySelector("#shareBtn").addEventListener("click", shareToMoments);
  document.querySelector("#savePosterBtn").addEventListener("click", savePosterImage);
  document.querySelector("#copyPosterBtn").addEventListener("click", copyPosterCopy);

  posterModal.querySelectorAll("[data-close-poster]").forEach((button) => {
    button.addEventListener("click", closePosterModal);
  });

  document.querySelector("#retryBtn").addEventListener("click", () => {
    document.querySelector("#posterCard").hidden = true;
    document.querySelector("#judgementCard").hidden = false;
    showScreen("form");
  });
}

renderCrimes();
bindEvents();
