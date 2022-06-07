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
 * Check speed instance and throws Error if incorrect
 *
 * @param {number} speed the speed to check
 * @returns the speed
 */
const checkSpeed = (speed) => {
    if (speed === undefined) {
        throw new Error('seriously? undefined "speed" parameter?...');
    } else if (typeof speed !== 'number') {
        throw new Error('"speed" parameter is not a number');
    } else if (speed <= 0) {
        throw new Error('"speed" parameter could not be lower than 0, OK Marthy?');
    } else {
        return speed;
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
 * @param {number} speed the player speed
 * @param {function} callback the callback to invoke when timer expire
 * @returns the create Timer
 */
const createTimer = (timerId, event, speed, callback) => {
    const effectiveDelay = Math.ceil(event.delay / speed);
    return new Timer(timerId, effectiveDelay, event.data, callback);
};


/**
 * The events player class.
 */
export default class EventsPlayer {

    /** The list of events to play */
    #events;

    /** The map containing the remaining events (ie not yet done) */
    #remainingEvents;

    /** The map containing the remaining active timers */
    #remainingTimers;

    /** The callback function to call on each played event */
    #callback;

    /** The player internal events listeners */
    #listeners;

    /** the internal state of the player */
    #state;

    /** The player speed. */
    #speed;

    /**
     * Constructor.
     *
     * @param {object[]} events the list of events to play
     * @param {function} callback function called on each played event
     * @param {number} speed the player speed (default to 1)
     */
    constructor(events, callback, speed = 1) {
        this.#events = checkEvents(events);
        this.#callback = checkCallback(callback);
        this.#speed = checkSpeed(speed);
        this.#listeners = {
            'state': emptyFunction,
            'speed': emptyFunction,
            'started': emptyFunction,
            'paused': emptyFunction,
            'resumed': emptyFunction,
            'stopped': emptyFunction,
            'done': emptyFunction
        };
        this.#state = 'initialised';
        this.#remainingTimers = new Map();
        this.#remainingEvents = new Map();
    }

    /**
     * Returns the player speed.
     *
     * @returns the current speed.
     */
    get speed() {
        return this.#speed;
    }

    /**
     * Change the player speed, quicker for value greater than 1, slower if lower than 1.
     *
     * @param {number} speed the player speed
     */
    set speed(speed) {
        const previousSpeed = this.#speed;
        this.#speed = checkSpeed(speed);

        if (this.#speed !== previousSpeed) {
            if ((this.#state === 'started') || (this.#state === 'resumed')) {
                this.#internalStop(false);
                this.#remainingEvents.forEach((event, id) => {
                    this.#scheduleEvent(id, event);
                });
            }

            this.#listeners.speed(this.#speed, previousSpeed);
        }
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
        if (withStateChanged && (this.#state !== 'initialised')) {
            this.#stateChanged('stopped');
        }
    }

    /**
     * Schedule the specified event, start and memorize a Timer.
     *
     * @param {string} id the event unique identifier
     * @param {object} event the event to schedule
     */
    #scheduleEvent(id, event) {
        // Create a timer callback, and delegate the call to this player callback
        const timerCallback = (t) => {
            // Timer is done, remove from the list of active timers
            this.#remainingTimers.delete(t.id);
            this.#remainingEvents.delete(t.id);
            // Call the player callback
            this.#callback(t.data);
            // If last event, notify that player is done!
            if (this.#remainingTimers.size === 0) {
                this.#stateChanged('done');
            }
        };

        // Create and start a timer for this event
        const timer = createTimer(id, event, this.#speed, timerCallback);
        timer.start();

        // Store the timer in the list of remaining active timers
        this.#remainingTimers.set(id, timer);
    }

    /**
     * Starts the player, schedule all events
     *
     * @param {number} delay the player delay position (default to 0)
     */
    start(delay = 0) {
        // Cancel all previous timers (several play() called)
        this.#internalStop(true);
        this.#remainingEvents.clear();
        this.#remainingTimers.clear();

        // Browse all events and start a timer
        this.#events.forEach((event, index) => {
            // Create and start a timer for this event
            const id = `${Date.now()}-${index}`;
            if (event.delay >= delay) {
                this.#scheduleEvent(id, event);
                this.#remainingEvents.set(id, event);
            }
        });
        this.#stateChanged('started');

        // If delay is after the last event, then the player is done
        if (this.#remainingTimers.size === 0) {
            this.#stateChanged('done');
        }
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
