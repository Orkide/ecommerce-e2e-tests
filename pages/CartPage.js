export class CartPage  {

    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.productName = page.locator('.inventory_item_name');
        this.checkOutButton = page.locator('#checkout');
    }

    async getCartItemCount(){
        return await this.cartItems.count();
    }

    async startCheckout(){
        await this.checkOutButton.click();
    }

    async getAddedItems() {
    // find all added items' name and price 
    const addedItems = this.page.locator('.cart_item'); 
    const count = await addedItems.count();

    const items = [];

    for (let i = 0; i < count; i++) {
        const item = addedItems.nth(i);
        const name = await item.locator('.inventory_item_name').textContent();
        const priceText = await item.locator('.inventory_item_price').textContent();
        if (!name || !priceText) throw new Error('Item name or price not found!');
        items.push({
            name: name.trim(),
            price: priceText.trim()
        });
    }

       return items; // [{name, price}, ...]
   }

    async removeProductFromCart(productName) {
        const productContainer = this.page.locator(`.cart_item:has-text("${productName}")`);
        await productContainer.locator('button:text("Remove")').click();
    }

    

}
