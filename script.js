const cards = [
  {
    name: "HDFC Infinia",
    annualFee: 12500,
    baseReward: 3.3,
    categories: { flights: 10, hotels: 10, dining: 6, online: 7, fuel: 3, all: 8 },
    benefits: ["travel", "lounge", "lifestyle"],
    travelFit: "high",
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
    why: [
      "Specialized rewards on fuel spends",
      "Good value for heavy driving usage",
      "Useful for commute-heavy profiles"
    ]
  }
];

const travelRank = { low: 1, medium: 2, high: 3 };

const form = document.getElementById("recommendForm");
const scenarioText = document.getElementById("scenarioText");
const resultsNode = document.getElementById("results");

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

function renderResults(list, context) {
  const categoryLabel = {
    flights: "flight bookings",
    hotels: "hotel bookings",
    dining: "dining",
    online: "online shopping",
    fuel: "fuel",
    all: "mixed spending"
  };

  scenarioText.textContent = `Context: ${categoryLabel[context.category]}, INR ${context.monthlySpend.toLocaleString("en-IN")}/month, ${context.benefit}`;

  resultsNode.innerHTML = "";

  list.forEach((card, index) => {
    const cardElement = document.createElement("article");
    cardElement.className = "result-card";
    cardElement.innerHTML = `
      <div class="result-head">
        <h3>${card.name}</h3>
        <span class="rank">#${index + 1} Match</span>
      </div>
      <p class="score">Fit score: ${card.fitScore}/16</p>
      <p>Annual fee: INR ${card.annualFee.toLocaleString("en-IN")}</p>
      <ul>${card.why.map((line) => `<li>${line}</li>`).join("")}</ul>
    `;
    resultsNode.appendChild(cardElement);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const context = {
    category: form.category.value,
    monthlySpend: Number(form.monthlySpend.value),
    benefit: form.benefit.value,
    travelFrequency: form.travelFrequency.value
  };

  renderResults(recommend(context), context);
});

form.dispatchEvent(new Event("submit"));
