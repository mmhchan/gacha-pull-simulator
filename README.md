# Gacha Probability Simulator

A Monte Carlo simulation tool designed to visualize the probability distributions and "Market Value" of gacha systems.

[Live Tool](https://mmhchan.github.io/gacha-pull-simulator/)

![Gacha Simulator Dashboard](./public/screenshot.png)

## 🧪 The Objective

Gacha systems often use "pity" mechanics (changes in pull rates) that make it difficult for players to calculate their true odds of success. This tool runs 10,000+ simulations in the browser to provide a data-driven look at:
- *What is the most likely pull count for a success?*
- *What is the statistical likelihood of success given the number of pulls I have available?*
- *What is the "Worst Case Scenario" cost in real-world currency?*

## 🚀 Key Features

- **Configurable Pity Logic:** Fine-tune Soft Pity ramps, Hard Pity thresholds, and Featured Guarantees.
- **Monte Carlo:** Real-time simulation of 10,000+ pull sequences.
- **Predefined Presets:** Compare systems Arknights: Endfield and other generic models.
- **50/50 Logic:** Accounts for "Limited Banner" rules where the first high-tier result may not be the featured character.
- **Inventory Based Odds:** Calculate success probability based on your current pull inventory.

## 📊 Simulation Logic

The simulator respects the following gacha mechanics:
1. **Base Rate:** The initial probability per pull.
2. **Soft Pity:** The point where the rate begins to climb.
3. **Hard Pity:** The absolute cap for a generic high-tier result.
4. **Featured Guarantee:** The absolute floor for the specific banner unit.

## 🛠️ Tech Stack

- **Framework:** React 19 (Vite 6+)
- **Language:** TypeScript
- **Visualization:** Recharts 3.x
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React

## 📥 Local Installation

```bash
# Clone the repository
git clone https://github.com/mmhchan/gacha-pull-simulator.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for GitHub Pages
npm run deploy
```

## ✉️ Contact
Created by **Michael Chan**
* **LinkedIn:** [linkedin.com/in/mmhchan](https://linkedin.com/in/mmhchan)