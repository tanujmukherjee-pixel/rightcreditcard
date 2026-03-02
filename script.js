const cards = [
  {
    name: "HDFC Infinia",
    annualFee: 12500,
    baseReward: 3.3,
    categories: { flights: 10, hotels: 10, dining: 6, online: 7, fuel: 3, all: 8 },
    benefits: ["travel", "lounge", "lifestyle"],
    travelFit: "high",
    merchantBoost: { smartbuy: 4, "airline-direct": 2, amazon: 1 },
    why: [
      "Strong reward acceleration on SmartBuy travel bookings",
      "High-value lounge and premium lifestyle benefits",
      "Good for high monthly spends"
    ]
  },
  {
    name: "Axis Atlas",
    annualFee: 5000,
    baseReward: 4,
    categories: { flights: 9, hotels: 9, dining: 5, online: 6, fuel: 2, all: 7 },
    benefits: ["travel", "lounge"],
    travelFit: "high",
    merchantBoost: { "airline-direct": 2, smartbuy: 1 },
    why: [
      "Miles-focused structure for travelers",
      "Useful transfer partners for flight/hotel redemptions",
      "Good value for frequent trips"
    ]
  },
  {
    name: "SBI Cashback Card",
    annualFee: 999,
    baseReward: 5,
    categories: { flights: 5, hotels: 5, dining: 4, online: 10, fuel: 2, all: 7 },
    benefits: ["cashback"],
    travelFit: "low",
    merchantBoost: { amazon: 2, myntra: 2, "swiggy-zomato": 1 },
    why: [
      "High and straightforward online cashback",
      "Simple redemption model",
      "Low annual fee"
    ]
  },
  {
    name: "HDFC Regalia Gold",
    annualFee: 2500,
    baseReward: 2.6,
    categories: { flights: 7, hotels: 7, dining: 6, online: 6, fuel: 2, all: 6 },
    benefits: ["travel", "lounge", "lifestyle"],
    travelFit: "medium",
    merchantBoost: { smartbuy: 2, "airline-direct": 1 },
    why: [
      "Balanced travel and lifestyle profile",
      "Accessible premium features",
      "Works well for mixed usage"
    ]
  },
  {
    name: "ICICI Amazon Pay Card",
    annualFee: 0,
    baseReward: 5,
    categories: { flights: 4, hotels: 4, dining: 3, online: 9, fuel: 1, all: 6 },
    benefits: ["cashback"],
    travelFit: "low",
    merchantBoost: { amazon: 4, myntra: 1 },
    why: [
      "No annual fee cashback option",
      "Strong fit for Amazon-heavy spending",
      "Easy to manage for first-time users"
    ]
  },
  {
    name: "BPCL SBI Card Octane",
    annualFee: 1499,
    baseReward: 3,
    categories: { flights: 2, hotels: 2, dining: 3, online: 3, fuel: 10, all: 4 },
    benefits: ["cashback"],
    travelFit: "low",
    merchantBoost: { "hpcl-bpcl-iocl": 4 },
    why: [
      "Specialized rewards on fuel spends",
      "Good value for heavy driving usage",
      "Useful for commute-heavy profiles"
    ]
  }
];

const travelRank = { low: 1, medium: 2, high: 3 };
const categoryLabel = {
  flights: "flight bookings",
  hotels: "hotel bookings",
  dining: "dining",
  online: "online shopping",
  fuel: "fuel",
  all: "mixed spending"
};
const merchantLabel = {
  generic: "any merchant",
  smartbuy: "HDFC SmartBuy",
  amazon: "Amazon India",
  myntra: "Myntra",
  "swiggy-zomato": "Swiggy / Zomato",
  "hpcl-bpcl-iocl": "HPCL / BPCL / IOCL",
  "airline-direct": "airline direct"
};

const form = document.getElementById("recommendForm");
const quickPickForm = document.getElementById("quickPickForm");
const scenarioText = document.getElementById("scenarioText");
const resultsNode = document.getElementById("results");
const quickResult = document.getElementById("quickResult");

function scoreCard(card, context) {
  let score = 0;

  score += card.categories[context.category] || card.categories.all;

  if (card.benefits.includes(context.benefit)) {
    score += 2.5;
  }

  const travelGap = Math.abs(travelRank[card.travelFit] - travelRank[context.travelFrequency]);
  score += Math.max(0, 2 - travelGap);

  if (context.monthlySpend >= 100000 && card.annualFee >= 5000) {
    score += 2;
  }

  if (context.monthlySpend <= 30000 && card.annualFee === 0) {
    score += 2;
  }

  if (context.category === "flights" && card.name === "HDFC Infinia") {
    score += 1.5;
  }

  if (context.merchant !== "generic") {
    score += card.merchantBoost[context.merchant] || 0;
  }

  return Number(score.toFixed(2));
}

function recommend(context) {
  return cards
    .map((card) => ({
      ...card,
      fitScore: scoreCard(card, context)
    }))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);
}

function getContextFromForm() {
  return {
    category: form.category.value,
    merchant: form.merchant.value,
    monthlySpend: Number(form.monthlySpend.value),
    benefit: form.benefit.value,
    travelFrequency: form.travelFrequency.value
  };
}

function renderResults(list, context) {
  scenarioText.textContent = `Context: ${categoryLabel[context.category]}, ${merchantLabel[context.merchant]}, INR ${context.monthlySpend.toLocaleString("en-IN")}/month, ${context.benefit}`;

  resultsNode.innerHTML = "";

  list.forEach((card, index) => {
    const cardElement = document.createElement("article");
    cardElement.className = "result-card";
    cardElement.innerHTML = `
      <div class="result-head">
        <h3>${card.name}</h3>
        <span class="rank">#${index + 1} Match</span>
      </div>
      <p class="score">Fit score: ${card.fitScore}/20</p>
      <p>Annual fee: INR ${card.annualFee.toLocaleString("en-IN")}</p>
      <ul>${card.why.map((line) => `<li>${line}</li>`).join("")}</ul>
    `;
    resultsNode.appendChild(cardElement);
  });
}

function recommendQuickCard(purchaseAmount, category, merchant) {
  const scored = cards
    .map((card) => {
      const categoryScore = card.categories[category] || card.categories.all;
      const merchantScore = merchant === "generic" ? 0 : card.merchantBoost[merchant] || 0;
      const rewardRate = Math.min(15, card.baseReward + categoryScore * 0.35 + merchantScore * 0.5);
      const estimatedValue = (purchaseAmount * rewardRate) / 100;

      return {
        ...card,
        rewardRate: Number(rewardRate.toFixed(2)),
        estimatedValue: Math.round(estimatedValue)
      };
    })
    .sort((a, b) => b.estimatedValue - a.estimatedValue);

  return scored[0];
}

function renderQuickResult(card, amount, category, merchant) {
  quickResult.innerHTML = `
    <div class="result-head">
      <h3>Best card now: ${card.name}</h3>
      <span class="rank">${card.rewardRate}% est. rate</span>
    </div>
    <p class="score">Estimated value on INR ${amount.toLocaleString("en-IN")}: INR ${card.estimatedValue.toLocaleString("en-IN")}</p>
    <p>Context: ${categoryLabel[category]}, ${merchantLabel[merchant]}</p>
    <p>Why: ${card.why[0]}</p>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const context = getContextFromForm();
  renderResults(recommend(context), context);
});

quickPickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(quickPickForm.purchaseAmount.value);
  const category = quickPickForm.quickCategory.value;
  const merchant = quickPickForm.quickMerchant.value;
  const bestCard = recommendQuickCard(amount, category, merchant);
  renderQuickResult(bestCard, amount, category, merchant);
});

form.addEventListener("change", () => {
  const context = getContextFromForm();
  renderResults(recommend(context), context);
});

form.addEventListener("input", () => {
  const context = getContextFromForm();
  renderResults(recommend(context), context);
});

quickPickForm.addEventListener("change", () => {
  const amount = Number(quickPickForm.purchaseAmount.value);
  const category = quickPickForm.quickCategory.value;
  const merchant = quickPickForm.quickMerchant.value;
  const bestCard = recommendQuickCard(amount, category, merchant);
  renderQuickResult(bestCard, amount, category, merchant);
});

quickPickForm.addEventListener("input", () => {
  const amount = Number(quickPickForm.purchaseAmount.value);
  const category = quickPickForm.quickCategory.value;
  const merchant = quickPickForm.quickMerchant.value;
  const bestCard = recommendQuickCard(amount, category, merchant);
  renderQuickResult(bestCard, amount, category, merchant);
});

form.dispatchEvent(new Event("submit"));
quickPickForm.dispatchEvent(new Event("submit"));
