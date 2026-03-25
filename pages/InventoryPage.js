export class InventoryPage {
    
    constructor(page) {
        this.page = page;
        this.addToCartButton = page.locator (".btn_inventory").first();
        this.firstProductName = this.page.locator('.inventory_item_name').first();
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartIcon = page.locator('.shopping_cart_link');
    }

    // Optional: add the first product for quick smoke tests
    async addFirstProductToCart(){
        this.selectedProductName = await this.firstProductName.textContent();
        await this.addToCartButton.click();
        return this.selectedProductName;  //we're gonna use it in test */
    }


    // Add a product to cart by its name
    // - We use productName to locate the specific product
    // - This works well with JSON data for multiple products
    async addProductToCart(productName) {
        // Locate the inventory item container by text
        const productContainer = this.page.locator(`.inventory_item:has-text("${productName}")`);
        
        // Wait for the product to be visible
        await productContainer.waitFor({ state: 'visible', timeout: 15000 }); // wait for 15 sec

        // Click the button inside that container
        await productContainer.locator('button').click();

        // Return the product name for assertion
        const selectedName = await productContainer.locator('.inventory_item_name').textContent();
        return selectedName;
    }

    async getAddedItems() {
    // find all added items' name and price 
    const addedItems = this.page.locator('.inventory_item:has(button:text("Remove"))'); // added items have "Remove" button 
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
   
    async getCartCount(){
        return await this.cartBadge.textContent();
    }


    async goToCart(){
        await this.cartIcon.click();
    }

    
}