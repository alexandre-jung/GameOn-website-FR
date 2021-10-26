/**
 * form.mjs
 * 
 * the registration form.
 */

import Mediator from "./mediator.mjs";
import { FormData, Checkbox, NumberInput } from './formData.mjs';
import Validator from './validator.mjs';

/**
 * class Form - the registration form.
 * handles the logic and validate fields on the fly.
 */
class Form extends Mediator {
    /**
     * constructor
     */
    constructor() {
        super();
        this.setupComponents();
        this.setupEvents();
        this.initData();
    }
    /**
     * create and add fields
     */
    setupComponents() {
        this.form = document.querySelector('form');
        this.firstData = this.add(new FormData(document.querySelectorAll('.formData')[0]));
        this.lastData = this.add(new FormData(document.querySelectorAll('.formData')[1]));
        this.emailData = this.add(new FormData(document.querySelectorAll('.formData')[2]));
        this.birthdateData = this.add(new FormData(document.querySelectorAll('.formData')[3]));
        this.tournamentsData = this.add(new NumberInput(document.querySelectorAll('.formData')[4]));
        this.conditionsData = this.add(new Checkbox(document.querySelectorAll('.formData')[6]));
    }
    /**
     * setup custom event handlers
     */
    setupEvents() {
        this.form.addEventListener('submit', this.handleSubmit);
        this.addEventHandler(this.firstData, 'change', this.handleNameChange);
        this.addEventHandler(this.lastData, 'change', this.handleNameChange);
        this.addEventHandler(this.emailData, 'change', this.handleEmailChange);
        this.addEventHandler(this.birthdateData, 'change', this.handleBirthdateChange);
        this.addEventHandler(this.tournamentsData, 'change', this.handleTournamentsChange);
        this.addEventHandler(this.conditionsData, 'change', this.handleConditionsChange);
    }
    /**
     * initialize fields data
     */
    initData() {
        this.clearInputs();
        this.data = {
            first: this.firstData.getValue(),
            last: this.lastData.getValue(),
            email: this.emailData.getValue(),
            birthdate: this.birthdateData.getValue(),
            tournaments: this.tournamentsData.getValue(),
            conditionsAccepted: this.conditionsData.getValue(),
        };
    }
    /**
     * validate fields data
     * @return `true` if the form is valid, else `false`
     */
    isValid() {
        const firstIsValid = Validator.name(this.data.first);
        const lastIsValid = Validator.name(this.data.last);
        const emailIsValid = Validator.email(this.data.email);
        const birthdateIsValid = Validator.birthdate(this.data.birthdate);
        const tournamentsIsValid = this.data.tournaments >= 0;
        const conditionsAccepted = this.data.conditionsAccepted;
        this.firstData.setState(firstIsValid ? 'valid' : 'invalid');
        this.lastData.setState(lastIsValid ? 'valid' : 'invalid');
        this.emailData.setState(emailIsValid ? 'valid' : 'invalid');
        this.birthdateData.setState(birthdateIsValid ? 'valid' : 'invalid');
        this.tournamentsData.setState(tournamentsIsValid ? 'valid' : 'invalid');
        this.conditionsData.setState(conditionsAccepted ? 'valid' : 'invalid');
        if (!firstIsValid) {
            this.firstData.sayNo();
        }
        if (!lastIsValid) {
            this.lastData.sayNo();
        }
        if (!emailIsValid) {
            this.emailData.sayNo();
        }
        if (!birthdateIsValid) {
            this.birthdateData.sayNo();
        }
        if (!tournamentsIsValid) {
            this.tournamentsData.sayNo();
        }
        return firstIsValid &&
            lastIsValid &&
            emailIsValid &&
            birthdateIsValid &&
            tournamentsIsValid &&
            conditionsAccepted;
    }
    /**
     * clear all fields
     */
    clearInputs() {
        this.components.map(component => {
            component.clear();
        });
    }
    /**
     * handle submit event
     */
    handleSubmit = event => {
        event.preventDefault();
        if (this.isValid()) {
            if (this.onSubmitSuccess) {
                this.onSubmitSuccess();
            }
            this.clearInputs();
        }
    }

    /************************************************
     * callbacks for fields changes
     ***********************************************/

    handleNameChange = ([target, name]) => {
        target.setState();
        target.resetMessage();
        let cleanName = name.trim().replace(/-+/, '-');
        if (cleanName.match(/[0-9]/)) {
            target.showMessage('vous ne pouvez pas saisir de chiffre');
            cleanName = cleanName.replace(/\d/, '');
        }
        if (cleanName) {
            target.setState(Validator.name(cleanName) ? 'valid' : 'invalid');
        }
        target.setValue(cleanName);
        switch (target) {
            case this.firstData:
                this.data.first = cleanName;
                break;
            case this.lastData:
                this.data.last = cleanName;
                break;
        }
    }
    handleEmailChange = ([target, email]) => {
        target.setState();
        const cleanEmail = email.trim();
        if (cleanEmail) {
            target.setState(Validator.email(cleanEmail) ? 'valid' : 'invalid');
        }
        target.setValue(cleanEmail);
        this.data.email = cleanEmail;
    }
    handleBirthdateChange = ([target, value]) => {
        target.setState();
        if (value) {
            target.setState(Validator.birthdate(value) ? 'valid' : 'invalid');
        }
        this.data.birthdate = value;
    }
    handleTournamentsChange = ([target, value]) => {
        const cleanTournaments = parseInt(value, 10);
        target.setState(cleanTournaments >= 0 ? 'valid' : 'invalid');
        target.setValue(cleanTournaments > 0 ? cleanTournaments : 0);
        this.data.tournaments = cleanTournaments;
    }
    handleConditionsChange = ([target, value]) => {
        target.setState();
        target.setState(value ? 'valid' : 'invalid');
        this.data.conditionsAccepted = value;
    }
}

export default Form;
