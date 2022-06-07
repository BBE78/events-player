/******************************************************************************
 *
 * Copyright (c) 2022 - Benoît BERTHONNEAU
 *
 *****************************************************************************/

/**
 * The player event callback.
 */
export type EventsPlayerCallback<E> = (event: E) => void;

/**
 * The player states.
 */
export type EventsPlayerState = "initialised" | "started" | "paused" | "resumed" | "stopped" | "done";

/**
 * The player properties to listen.
 */
type EventsPlayerProperty = "state" | "speed";

/**
 * The player event's name to listen.
 */
export type EventName = EventsPlayerState | EventsPlayerProperty;

/**
 * The player state listener.
 */
export type EventsPlayerListener = (eventName: EventName, newValue?: string | number, oldValue?: string | number) => void;

/**
 * The events player class.
 */
export default class EventsPlayer<E> {

    /**
     * Constructor.
     *
     * @param {E[]} events the list of events to play
     * @param {EventsPlayerCallback} callback function called on each played event
     * @param {number} speed the player speed (default to 1)
     */
    constructor(events: E[], callback: EventsPlayerCallback<E>, speed = 1);

    /**
     * Change the player speed, quicker for value greater than 1, slower if lower than 1.
     *
     * @param {number} newSpeed the player speed, greater than 0
     */
    set speed(newSpeed: number);

    /**
     * Returns the player speed.
     *
     * @returns the current speed.
     */
    get speed(): number;

    /**
     * Register a listener for the specified changes
     *
     * @param {string} eventName the state to listen
     * @param {EventsPlayerListener} listener the function to call upon changes
     */
    on(eventName: string, listener: EventsPlayerListener): void;

    /**
     * Starts the player, schedule all events
     *
     * @param {number} delay the player delay (default to 0)
     */
    start(delay?: number): void;

    /**
     * Pause all remaning player events
     */
    pause(): void;

    /**
     * Resume all remaining player events
     */
    resume(): void;

    /**
     * Stop all remaning player events
     */
    stop(): void;

 }
