import { LoginPage } from '../../pages/LoginPage'
import { InventoryPage } from '../../pages/InventoryPage'
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import users from '../../test-data/users.json';
import formInputs from '../../test-data/checkout.json';
import { test, expect } from '@playwright/test';

//should complete checkout successfully with valid user
test('should complete checkout successfully with valid user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  //valid login
  await loginPage.goto();
  await loginPage.login(users.validUser.username , users.validUser.password);
  
  await expect(page).toHaveURL(/inventory/);

  //remove product from the cart
  //await inventoryPage.removeFromCart();

  //await expect(inventoryPage.cartBadge).toHaveCount(0);

  //add product a cart
  const productName = await inventoryPage.addFirstProductToCart();
  await inventoryPage.goToCart();


  //Check badge
  await expect(inventoryPage.cartBadge).toHaveText('1');

  //Check product name
  await expect(cartPage.productName).toHaveText(productName);

  //checkout
  await cartPage.checkOutButton.click();

  //fill checkout form
  const user = formInputs.validUsers[0];
  await checkoutPage.fillCheckoutForm(user.firstName, user.lastName, user.postalCode);

  //finish
  await checkoutPage.finishCheckout();

  //check success message
  //await page.pause();
  await expect(checkoutPage.getSuccessMessage()).toBeVisible();
  await expect(checkoutPage.getSuccessMessage()).toHaveText(/thank you for your order/i);
  

});

