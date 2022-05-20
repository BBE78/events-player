/******************************************************************************
 *
 * Copyright (c) 2022 - Benoît BERTHONNEAU
 *
 *****************************************************************************/

/**
 * A timer class
 */
export default class Timer {

    /** The remaining delay (in ms) */
    #remaining;

    /** The callback that should be called when timer expire */
    #callback;

    /** The internal timer state */
    #state;

    /** The timeout identifier, when timeout instanciated */
    #timeoutID;

    /** The timer start time (in ms) */
    #startTime;

    /**
     * Constructor.
     *
     * @param {any} id
     * @param {number} delay
     * @param {any} data
     * @param {function} callback
     */
    constructor(id, delay, data, callback) {
        this.id = id;
        this.data = data;
        this.#remaining = delay;
        this.#callback = callback;
        this.#state = 'initialised';
        this.#timeoutID = false;
        this.#startTime = 0;
    }

    /**
     * Start the timer (only if remaining delay > 0)
     */
    start() {
        this.cancel();
        if (this.#remaining > 0) {
            this.#startTime = Date.now();
            this.#timeoutID = setTimeout((timer) => {
                this.#timeoutID = false;
                this.#state = 'done';
                this.#callback(timer);
            }, this.#remaining, this);
            this.#state = 'started';
        }
    }

    /**
     * Cancel the timer (only if still running)
     */
    cancel() {
        if (this.#timeoutID) {
            clearTimeout(this.#timeoutID);
            this.#timeoutID = false;
            this.#state = 'canceled';
        }
    }

    /**
     * Pause the timer (only if previously started)
     */
    pause() {
        if (this.#state === 'started') {
            this.#remaining -= Date.now() - this.#startTime;
            this.cancel();
            this.#state = 'paused';
        }
    }

    /**
     * Resume the timer (only if previously paused)
     */
    resume() {
        if (this.#state === 'paused') {
            this.start();
        }
    }

}
