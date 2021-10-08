import Mediator from "./mediator.mjs";

class FormData extends Mediator.Component {
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
    getValue() {
        return this.input.value;
    }
    setValue(value) {
        this.input.value = value;
    }
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
    sayNo() {
        this.element.classList.add('say-no');
        this.setBackground();
        setTimeout(this.resetSayNo, 500);
    }
    resetSayNo = () => {
        this.element.classList.remove('say-no');
    }
    setBackground() {
        this.input.classList.add('red');
    }
    resetBackground = () => {
        this.input.classList.remove('red');
    }
    clear() {
        this.input.value = '';
        this.setState();
        this.resetBackground();
    }
    handleValueChange = () => {
        this.notify('change', [this, this.getValue()]);
    }
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
    resetMessage() {
        this.element.classList.remove('message-only');
        this.element.dataset.error = this.defaultMessage;
    }
}

class Checkbox extends FormData {
    getValue() {
        return this.input.checked;
    }
    clear() {
        this.input.checked = false;
        this.setState();
    }
    handleValueChange = () => {
        this.notify('change', [this, this.getValue()]);
    }
}

class NumberInput extends FormData {
    constructor(element) {
        super(element);
        this.input.addEventListener('keydown', this.handleValueChange);
        this.input.addEventListener('input', this.handleValueChange);
    }
    clear() {
        this.input.value = 0;
        this.setState();
    }
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
