/**
 * formData.mjs
 * 
 * various form fields that notify the mediator
 * on every change in their values.
 * also expose some methods for displaying errors
 * and control the values (as `controlled inputs` in React).
 */

import Mediator from "./mediator.mjs";

/**
 * class FormData
 * 
 * basic form field. used as is, handles a text field.
 * also used as a base class for other input types.
 */
class FormData extends Mediator.Component {
    /**
     * contructor
     */
    constructor(element, inputHandler = null) {
        super();
        this.element = element;
        this.input = element.querySelector('input');
        this.input.addEventListener('input', this.handleValueChange);
        this.input.addEventListener('focus', this.resetBackground);
        this.input.addEventListener('input', this.resetBackground);
        this.timeout = null;
        this.defaultMessage = this.element.dataset.error;
    }
    /**
     * return the field value
     * @return string
     */
    getValue() {
        return this.input.value;
    }
    /**
     * set the input value
     */
    setValue(value) {
        this.input.value = value;
    }
    /**
     * set the validation state
     * @param {string} state
     * valid - show valid state  
     * invalid - display error  
     * empty - default state (not valid nor invalid)
     */
    setState(state = '') {
        switch (state) {
            case 'valid':
                delete this.element.dataset.errorVisible;
                break;
            case 'invalid':
                this.element.dataset.errorVisible = true;
                break;
            default:
                this.element.dataset.errorVisible = false;
        }
    }
    /**
     * animate when field is invalid
     */
    sayNo() {
        this.element.classList.add('say-no');
        this.setBackground();
        setTimeout(this.resetSayNo, 500);
    }
    /**
     * remove the animation
     */
    resetSayNo = () => {
        this.element.classList.remove('say-no');
    }
    /**
     * set error style
     */
    setBackground() {
        this.input.classList.add('red');
    }
    /**
     * remove error style
     */
    resetBackground = () => {
        this.input.classList.remove('red');
    }
    /**
     * reset the field value
     */
    clear() {
        this.input.value = '';
        this.setState();
        this.resetBackground();
    }
    /**
     * handle field value change
     */
    handleValueChange = () => {
        this.notify('change', [this, this.getValue()]);
    }
    /**
     * show error message for a given period of time
     */
    showMessage(message, duration = 2000) {
        clearTimeout(this.timeout);
        this.element.dataset.error = message;
        this.element.classList.add('message-only');
        this.timeout = setTimeout(() => {
            this.element.classList.remove('message-only');
            setTimeout(() => {
                this.element.dataset.error = this.defaultMessage;
            }, 300);
        }, duration);
    }
    /**
     * remove temporary message before timeout
     */
    resetMessage() {
        this.element.classList.remove('message-only');
        this.element.dataset.error = this.defaultMessage;
    }
}

/**
 * class Checkbox
 */
class Checkbox extends FormData {
    /**
     * get checkbox value
     * @return `true` if checked, else `false`
     */
    getValue() {
        return this.input.checked;
    }
    /**
     * reset the field value
     */
    clear() {
        this.input.checked = false;
        this.setState();
    }
    /**
     * handle field value change
     */
    handleValueChange = () => {
        this.notify('change', [this, this.getValue()]);
    }
}

/**
 * class NumberInput
 */
class NumberInput extends FormData {
    /**
     * contructor
     */
    constructor(element) {
        super(element);
        this.input.addEventListener('keydown', this.handleValueChange);
        this.input.addEventListener('input', this.handleValueChange);
    }
    /**
     * reset the field value
     */
    clear() {
        this.input.value = 0;
        this.setState();
    }
    /**
     * handle field value change
     */
    handleValueChange = ev => {
        if (ev.type === 'input') {
            this.notify('change', [this, this.getValue()]);
        }
        const backspace = ev.key === 'Backspace';
        const enter = ev.key === 'Enter';
        const digit = ev.key >= '0' && ev.key <= '9'
        if (backspace || enter || digit) {
            this.notify('change', [this, this.getValue()]);
        } else {
            ev.preventDefault();
        }
    }
}

export { FormData, Checkbox, NumberInput };
