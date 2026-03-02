# RightCreditCard

A lightweight website tool that recommends the best credit card for a given spending context.

## What it does

- Takes user context: use case, monthly spend, preferred benefit, travel frequency.
- Scores cards using deterministic rules.
- Shows top 3 cards with a fit score and clear reasons.

## Run locally

1. Open `index.html` directly, or run a local static server:
   - `python3 -m http.server 8080`
2. Visit `http://localhost:8080`

## Notes

- Includes examples like `HDFC Infinia` for flight-heavy contexts.
- Recommendation logic is in `script.js` and can be expanded with more cards/weights.
- This tool is informational and not financial advice.
