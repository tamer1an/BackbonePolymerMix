class LoginPageController {

    constructor ($state, LoginPageFactory, Restangular) {
        this.LoginService = LoginPageFactory;
        this.$state = $state;
        this.userModel = {
            name: '',
            password: ''
        };
        this.validation = {
            formValid: true,
            message: 'The Username or Password you entered is incorrect.',
            invalidBorder: '{\'border-color\':\'blue\'}'
        };

    }

    validate () {
        this.userModel.name.length && this.userModel.password.length ?
            this.validation.formValid = true : this.validation.formValid = false;
    }

    submitData () {
        this.validate();
        if(this.validation.formValid) {
            return this.LoginService.post(this.userModel)
                .then((data) => {
                    this.LoginService.setToken({'Authorization': 'Bearer ' + data.access_token});
                    this.$state.go('bidManagement');
                }, (reason) => {
                    this.validation.formValid = false;
                });
        }
    }

    testData () {
        this.testValue1 = 12333;
    }
}

export default LoginPageController;
