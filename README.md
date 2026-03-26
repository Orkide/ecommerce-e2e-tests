# 🧪 Playwright E2E Tests - E-commerce

This project contains end-to-end (E2E) tests for an e-commerce web application using **Playwright**.

## 🚀 Features

- ✅ Login tests (success & edge cases)
- ✅ Add to cart functionality
- ✅ Remove items from cart
- ✅ Checkout flow (happy path)
- ✅ Invalid checkout form validations
- ✅ Edge case coverage

---

## 🛠️ Tech Stack

- Playwright
- JavaScript (Node.js)
- GitHub Actions (CI/CD)

---

## 📂 Project Structure

├── tests/ # Test files
├── pages/ # Page Object Model (POM)
├── test-data/ # Test data (JSON)
├── .github/ # CI/CD workflows
├── playwright.config.js
├── package.json


---

## ⚙️ Installation

```bash
npm install
npx playwright install  

## ⚙️ run test
npx playwright test

## run in headen mode
npx playwright test --headed

## CI/CD
Tests are automatically executed using GitHub Actions on every push.

## Notes
screenshots/, test-results/, and playwright-report/ are ignored via .gitignore
These are generated during test execution



## Goal
This project is built to practice:
Real-world test scenarios
Edge case handling
Clean test architecture (POM)
CI/CD integration


# My Project
![GitHub Actions](https://github.com/Orkide/ecommerce-e2e-tests/blob/main/.github/workflows/ci.yml)