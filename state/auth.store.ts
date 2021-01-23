import { action, observable } from 'mobx';

class AuthStore {
    @observable
    user: any;

    @action
    signIn(authData: { email: string, password: string }) {

    }

    signUp(authData: { email: string, password: string, syncData: boolean }) {
        // TODO Billing
        // TODO data sync - function likely...
    }
}
