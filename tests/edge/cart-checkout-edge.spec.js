import { LoginPage } from '../../pages/LoginPage';
import { Checkout, CheckoutPage } from '../../pages/CheckoutPage';
import { CartPage } from '../../pages/CartPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { test as base, expect } from '@playwright/test';
import users from '../../test-data/users.json';
import products from '../../test-data/products.json';
import formInputs from '../../test-data/checkout.json';

// Extend test with loginPage fixture
const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await use(loginPage);
  }
});

// -------------------- Cart Edge Cases --------------------

test('add all products from JSON and verify cart count', async ({ page , loginPage}) => {
  const inventoryPage = new InventoryPage(page);
  
  // 1️⃣ Loop through all products from JSON and add them to the cart
  // - This ensures our test is dynamic and can handle any number of products
  for (const product of products.items) {
    await inventoryPage.addProductToCart(product.name);
    console.log('Added to cart:', product.name); // Log for debug / verification
  }
  // 2️⃣ Go to the Cart page
  
  await inventoryPage.goToCart();

  // 3️⃣ Verify the number of items in the cart
  // - getCartItemsCount() returns the number of items currently in the cart
  const cartPage = new CartPage(page);
  const cartCount = await cartPage.getCartItemCount();

  // Compare the cart item count with the number of products in JSON
  expect(cartCount).toBe(products.items.length);

  console.log(`Cart contains ${cartCount} items, expected ${products.items.length}`);
});


test('should calculate correct total price for multiple items', async ({ page , loginPage }) => {
  
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  const addedProducts = [];

  //add items to cart
  for (const product of products.items) {
        await inventoryPage.addProductToCart(product.name);
        //console.log('Added to cart:', product.name);
        addedProducts.push(product.name);
    }

  // Get prices of the added items from the UI
  const itemsInCart = await inventoryPage.getAddedItems();

    let expectedTotal = 0;

    for (const item of itemsInCart) {
        //console.log('Item in UI:', item.name, item.price);
        expectedTotal += parseFloat(item.price.replace('$', ''));
        await expect(addedProducts).toContain(item.name); // Verify that the item name matches the added products
    }

    await inventoryPage.goToCart();

  //checkout
  await cartPage.checkOutButton.click();

  //fill checkout form
  const user = formInputs.validUsers[0];
  await checkoutPage.fillCheckoutForm(user.firstName, user.lastName, user.postalCode);

  // Get total price displayed on the checkout overview page
  const totalText = await checkoutPage.getTotalPrice(); 
  const taxText = await checkoutPage.getTaxPrice();  

  // Extract numeric value from total and tax text
  const actualTotal = parseFloat(totalText.replace('Total: $', ''));
  const taxAmount = parseFloat(taxText.replace('Tax: $', ''));

  const expectedTotalWithTax = expectedTotal + taxAmount;

  // Log
  console.log('--- Checkout Overview ---'); 
  console.log('Products added and their prices:');
  console.table(itemsInCart.map(item => ({
     Name: item.name,
     Price: item.price
  })));
  
  console.log('Expected total (products only):', expectedTotal.toFixed(2));
  console.log('Tax from UI:', taxAmount.toFixed(2));
  console.log('Expected total including tax:', expectedTotalWithTax.toFixed(2));
  console.log('Actual total from UI:', actualTotal.toFixed(2));
  console.log('-------------------------');

  // Verify that calculated total matches the displayed total  -- Assertion
  await expect(actualTotal).toBeCloseTo(expectedTotalWithTax, 2);

});

test('should remove an item from cart and update total correctly', async ({ page , loginPage }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const addedProducts = [];

    // 1. Add iteems to the cart
    for (const product of products.items) {
        await inventoryPage.addProductToCart(product.name);
        addedProducts.push(product.name);
    }

    console.log('Products added to cart:', addedProducts);

    await inventoryPage.goToCart();

    // 2. Remove the first item 
    const itemToRemove = addedProducts[0];
    console.log('Removing item:', itemToRemove);
    await cartPage.removeProductFromCart(itemToRemove);

    // 3. Get the remaining items in the cart
    const remainingItems = await cartPage.getAddedItems(); // [{name, price}, ...]
    
    console.log('Remaining items in cart:');
    console.table(remainingItems.map(item => ({ Name: item.name, Price: item.price })));

    // 4. Calculate price
    let expectedTotal = 0;
    for (const item of remainingItems) {
        expectedTotal += parseFloat(item.price.replace('$',''));
    }

    // 5. Add Checkout and tax 
    await cartPage.checkOutButton.click();
    const user = formInputs.validUsers[0];
    await checkoutPage.fillCheckoutForm(user.firstName, user.lastName, user.postalCode);

    const totalText = await checkoutPage.getTotalPrice();
    const taxText = await checkoutPage.getTaxPrice();

    const actualTotal = parseFloat(totalText.replace('Total: $', ''));
    const taxAmount = parseFloat(taxText.replace('Tax: $', ''));

    const expectedTotalWithTax = expectedTotal + taxAmount;

    console.log('Expected total after removal (with tax):', expectedTotalWithTax.toFixed(2));
    console.log('Actual total from UI:', actualTotal.toFixed(2));

    // 6. Assertion
    await expect(actualTotal).toBeCloseTo(expectedTotalWithTax, 2);

    //Also verify that the removed item no longer appears in the cart
    const remainingNames = remainingItems.map(item => item.name);
    await expect(remainingNames).not.toContain(itemToRemove);

});

test('should block checkout for missing required fields', async({page , loginPage}) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    //Add first product to cart
    const productName =  await inventoryPage.addFirstProductToCart();
    await inventoryPage.goToCart();

    //Check badge
    await expect(inventoryPage.cartBadge).toHaveText('1');

    //Check product name
    await expect(cartPage.productName).toHaveText(productName);

    //checkout
    await cartPage.checkOutButton.click();


    /**
     * Loop through each invalid checkout case from the JSON data.
     * Fills the checkout form with the provided missing field(s),
     * submits the form, and checks that the error message is displayed.
     */
    for (const caseData of formInputs.missingFields) {
        console.log('Testing missing filed case: ', caseData)
        //Fill the form
        await checkoutPage.fillCheckoutForm(caseData.firstName, caseData.lastName, caseData.postalCode);
       
        // Check error message after submitting
        const errorMessage = await checkoutPage.getErrorMessage(); 

       // Log
       console.log('Error message shown:', errorMessage);

        // Assertion :  An error message should be seen
        // await expect(checkoutPage.getErrorMessage()).toBeVisible();
       await expect(errorMessage).toBeTruthy(); 
    
    }


});

