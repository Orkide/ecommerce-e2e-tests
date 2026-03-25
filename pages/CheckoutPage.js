import { expect } from "playwright/test";

export class CheckoutPage{
    constructor(page){
        this.page = page;
        this.firstName = page.locator('#first-name');
        this.lastName = page.locator('#last-name');
        this.postalCode = page.locator('#postal-code');
        this.continueButton = page.locator('#continue');
        this.finishButton = page.locator('#finish');
        this.successMessage = page.locator('.complete-header');
        this.subTotalPrice = page.locator('.summary_total_label');
        this.taxPrice = page.locator('.summary_tax_label');
        this.errorMessage = '[data-test="error"]';

    }

    async fillCheckoutForm(first,last,postal){
        await this.firstName.fill(first);
        await this.lastName.fill(last);
        await this.postalCode.fill(postal);
        await this.continueButton.click();
    }

    async finishCheckout(){
        await this.finishButton.click();
    }

    getSuccessMessage(){
        return this.successMessage;
    }

    async getTotalPrice(){
        return await this.subTotalPrice.textContent();
    }

    async getTaxPrice(){
        return await this.taxPrice.textContent();
    }
    
    async getErrorMessage() {
        const error = this.page.locator(this.errorMessage);
        await expect(error).toBeVisible(); 
        return await error.textContent();
    }
    
}