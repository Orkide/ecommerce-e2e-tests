import { LoginPage } from '../../pages/LoginPage' ;
import { test as base, expect } from '@playwright/test';

import users from '../../test-data/users.json';

// Extend test with loginPage fixture
const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage); // loginPage is ready in tests
  },
});


// Test for a locked out user
test('login with invalidUser (locked out user)', async({loginPage})=> {
    const user = users.invalidUser;
    await loginPage.login(user.username, user.password);
    await expect(loginPage.getErrorMessage()).toBeVisible();
    // Verify that the error message displays the correct "locked out" warning 
    // when a locked_out_user attempts to log in
    await expect(loginPage.getErrorMessage()).toContainText('locked out');
});

// Test for empty username
test('login with emptyUsername', async({loginPage})=> {
    const user = users.emptyUsername;
    await loginPage.login(user.username, user.password);
     await expect(loginPage.getErrorMessage()).toBeVisible();
    // Verify that the error message displays the correct "username is required" warning 
    await expect(loginPage.getErrorMessage()).toContainText('Username is required');
});

// Test for empty password
test('login with emptyPassword', async({loginPage})=> {
    const user = users.emptyPassword;
    await loginPage.login(user.username, user.password);
    await expect(loginPage.getErrorMessage()).toBeVisible();
    // Verify that the error message displays the correct "password is required" warning 
    // when a standart_user attempts to log in without password
    await expect(loginPage.getErrorMessage()).toContainText('Password is required');
});

// Test for wrong user
test('login with wrongUser', async({loginPage})=> {
    const user = users.wrongUser;
    await loginPage.login(user.username, user.password);
    await expect(loginPage.getErrorMessage()).toBeVisible();
    // Verify that the error message displays the correct "Username and password do not match any user in this service" warning 
    await expect(loginPage.getErrorMessage()).toContainText('Username and password do not match any user in this service');
});