
export class LoginPage {

    constructor(page) {
        this.page = page;

        this.loginUsername = page.locator('#user-name');
        this.loginPassword = page.locator('#password');
        this.loginButton = '#login-button';
        this.errorMessage = '[data-test="error"]';
    }

    async goto(){
        await this.page.goto('https://www.saucedemo.com')
    }

    async login(username, password){
        await this.loginUsername.fill(username);
        await this.loginPassword.fill(password);
        await this.page.click(this.loginButton);
    }

    getErrorMessage(){
        return this.page.locator(this.errorMessage);
    }

}


 