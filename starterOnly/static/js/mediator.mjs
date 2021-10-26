/**
 * mediator.mjs
 * 
 * mediator and component base class.
 * every component has a `notify` class to send
 * custom events to its parent (the mediator).
 */

/**
 * class Mediator
 */
export default class Mediator {
    /**
     * constructor
     */
    constructor() {
        this.handlers = new Map();
        this.components = [];
    }
    /**
     * add a child component
     */
    add(component) {
        component._attach(this);
        this.components.push(component);
        return component;
    }
    /**
     * receive a custom event
     * used internally, should not be called by user
     */
    beNotified(target, event, data) {
        const handlers = this.handlers.get(target);
        if (handlers !== undefined && event in handlers) {
            handlers[event](data);
        }
    }
    /**
     * add a callback for custom events
     */
    addEventHandler(target, event, handler) {
        let handlers = this.handlers.get(target);
        if (handlers === undefined) {
            handlers = { [event]: handler };
        } else {
            handlers[event] = handler;
            this.handlers.set(target, handlers);
        }
        this.handlers.set(target, handlers);
    }
}

/**
 * class Component
 */
class Component extends Mediator {
    /**
     * set this component's mediator
     * used internally, should not be called by user
     */
    _attach(mediator) {
        this.mediator = mediator;
    }
    /**
     * send a custom event to the mediator
     */
    notify(event, data) {
        this.mediator?.beNotified(this, event, data);
        if (!this.mediator) {
            console.warn('no mediator attached');
        }
    }
}

Mediator.Component = Component;
