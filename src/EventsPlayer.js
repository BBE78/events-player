/******************************************************************************
 *
 * Copyright (c) 2022 - Benoît BERTHONNEAU
 *
 *****************************************************************************/

import Timer from './Timer.js';

/**
 * Check events instance and throws Error if incorrect
 *
 * @param {object[]} events the events to check
 * @returns the events sorted on their delay
 */
const checkEvents = (events) => {
    if (events === undefined) {
        throw new Error('seriously? undefined "events" parameter?...');
    } else if (!Array.isArray(events)) {
        throw new Error('"events" parameter should be an array');
    } else if (events.length === 0) {
        throw new Error('seriously? an empty "events" array parameter?...');
    } else {
        return events.sort((a, b) => a.delay - b.delay);
    }
};


/**
 * Check callback instance and throws Error if incorrect
 *
 * @param {function} callback the callback to check
 * @returns the callback
 */
const checkCallback = (callback) => {
    if (callback === undefined) {
        throw new Error('seriously? undefined "callback" parameter?...');
    } else if (typeof callback !== 'function') {
        throw new Error('"callback" parameter is not a function');
    } else {
        return callback;
    }
};


/**
 * Empty function implementation
 */
const emptyFunction = () => {
    // does nothing...
};


/**
 * Creates and returns a Timer
 *
 * @param {string} timerId a unique identifier
 * @param {object} event the player event
 * @param {function} callback the callback to invoke when timer expire
 * @returns the create Timer
 */
const createTimer = (timerId, event, callback) => {
    return new Timer(timerId, event.delay, event.data, callback);
};


/**
 * The events player class.
 */
export default class EventsPlayer {

    /** The callback function to call on each played event */
    #callback;

    /** The player internal events listeners */
    #listeners;

    /** The map containing the remaining active timers */
    #remainingTimers;

    /** the internal state of the player */
    #state

    /**
     * Constructor.
     *
     * @param {object[]} events the list of events to play
     * @param {function} callback function called on each played event
     */
    constructor(events, callback) {
        this.events = checkEvents(events);
        this.#callback = checkCallback(callback);
        this.#listeners = {
            'state': emptyFunction,
            'started': emptyFunction,
            'paused': emptyFunction,
            'resumed': emptyFunction,
            'stopped': emptyFunction,
            'done': emptyFunction
        };
        this.#state = 'initialised';
        this.#remainingTimers = new Map();
    }

    /**
     * Register a listener for the specified changes
     *
     * @param {string} eventName the state to listen
     * @param {function} callback the function to call upon changes
     */
    on(eventName, callback) {
        this.#listeners[eventName] = callback || emptyFunction;
    }

    /**
     * Change the internal player state and notify listeners
     *
     * @param {string} state the new state
     */
    #stateChanged(state) {
        if (this.#state !== state) {
            const previousState = this.#state;
            this.#state = state;
            this.#listeners.state(this.#state, previousState);
            this.#listeners[this.#state](this.#state);
        }
    }

    /**
     * Stop all remaining player events
     *
     * @param {boolean} withStateChanged "true" to change the player state to "stopped"
     */
    #internalStop(withStateChanged) {
        // Cancel all remaning active timers
        this.#remainingTimers.forEach(timer => timer.cancel());
        if (withStateChanged) {
            this.#stateChanged('stopped');
        }
    }

    /**
     * Starts the player, schedule all events
     */
    start() {
        // Cancel all previous timers (several play() called)
        this.#internalStop(false);
        this.#remainingTimers = new Map();

        // Browse all events and start a timer
        for (let i = 0; i < this.events.length; i++) {
            // Create a timer callback, and delegate the call to this player callback
            const timerCallback = (t) => {
                // Timer is done, remove from the list of active timers
                this.#remainingTimers.delete(t.id);
                // Call the player callback
                this.#callback(t.data);
                // If last event, notify that player is done!
                if (this.#remainingTimers.size === 0) {
                    this.#stateChanged('done');
                }
            };

            // Create and start a timer for this event
            const timerId = `${Date.now()}-${i}`;
            const timer = createTimer(timerId, this.events[i], timerCallback);
            timer.start();

            // Store the timer is the list of remaining active timers
            this.#remainingTimers.set(timerId, timer);
        }
        this.#stateChanged('started');
    }

    /**
     * Pause all remaning player events
     */
    pause() {
        if ((this.#state === 'started') || (this.#state === 'resumed')) {
            // Pause all remaning active timers
            this.#remainingTimers.forEach(timer => timer.pause());
            this.#stateChanged('paused');
        }
    }

    /**
     * Resume all remaining player events
     */
    resume() {
        if (this.#state === 'paused') {
            // Resume all remaning active timers
            this.#remainingTimers.forEach(timer => timer.resume());
            this.#stateChanged('resumed');
        }
    }

    /**
     * Stop all remaning player events
     */
    stop() {
        // Cancel all remaning active timers
        this.#internalStop(true);
    }

}
