# 🚀 Playwright E2E Tests - E-commerce [![GitHub Actions](https://github.com/Orkide/ecommerce-e2e-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/Orkide/ecommerce-e2e-tests/actions/workflows/ci.yml)

This project contains **end-to-end (E2E) tests** for an e-commerce web application using **Playwright**.

---

## 🗂 Project Structure
├── tests/ # Test files
├── pages/ # Page Object Model (POM)
├── test-data/ # Test data (JSON)
├── .github/ # CI/CD workflows
├── playwright.config.js
├── package.json

---

## 🧪 Test Cases / Features

### ✅ Full Happy Path
- **Description:** Complete checkout successfully with valid user.  
- **File:** `e2e/ecommerce-flow.spec.js:10`  
- [ ] Login → Add item(s) to cart → Checkout → Complete order → Verify success message

### ⚡ Cart / Checkout Edge Cases
- **Description:** Add all products from JSON and verify cart count.  
- **File:** `edge/cart-checkout-edge.spec.js:22`  
- [ ] Add multiple items → Verify total price  
- [ ] Remove an item from cart → Verify cart updates correctly

- **Description:** Should block checkout for missing required fields  
- **File:** `edge/cart-checkout-edge.spec.js:170`  
- [ ] Missing First Name / Last Name / Zip → Verify error messages  
- [ ] Fill all fields correctly → Complete checkout → Verify success message

### ❌ Negative Login Cases
- **Description:** Login with invalid or incorrect credentials  
- **File:** `negative/login-negative.spec.js`  
- [ ] Login with `invalidUser` (locked out) → Verify error  
- [ ] Login with empty username → Verify error  
- [ ] Login with empty password → Verify error  
- [ ] Login with wrong username → Verify error

---

## 🛠 Tech Stack
- Playwright  
- JavaScript (Node.js)  
- GitHub Actions (CI/CD)

---

## ⚡ Installation & Run
```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npx playwright test

# Run tests in headed mode
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


