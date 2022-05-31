# events-player

A JavaScript events player, for browsers or Node.js.

<p align="center">
	<a href="https://github.com/BBE78/events-player/actions/workflows/ci.yml"><img src="https://github.com/BBE78/events-player/actions/workflows/ci.yml/badge.svg"></a>
	<a href="https://app.fossa.com/projects/git%2Bgithub.com%2FBBE78%2Fevents-player?ref=badge_shield"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FBBE78%2Fevents-player.svg?type=shield"></a>
	<a href="https://www.codacy.com/gh/BBE78/events-player/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=BBE78/events-player&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/0ac0bcd2397c492f9e60165260c37e34"/></a>
	<a href="https://www.codacy.com/gh/BBE78/events-player/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=BBE78/events-player&amp;utm_campaign=Badge_Coverage"><img src="https://app.codacy.com/project/badge/Coverage/0ac0bcd2397c492f9e60165260c37e34"/></a>
	<br/>
	<a href="https://sonarcloud.io/summary/overall?id=BBE78_events-player"><img src="https://sonarcloud.io/api/project_badges/measure?project=BBE78_events-player&metric=alert_status" alt="sonarcloud" title="SonarCloud quality gate"></a>
	<a href="https://sonarcloud.io/summary/overall?id=BBE78_events-player"><img src="https://sonarcloud.io/api/project_badges/measure?project=BBE78_events-player&metric=vulnerabilities" alt="sonarcloud" title="SonarCloud vulnerabilities"></a>
	<a href="https://sonarcloud.io/summary/overall?id=BBE78_events-player"><img src="https://sonarcloud.io/api/project_badges/measure?project=BBE78_events-player&metric=bugs" alt="sonarcloud" title="SonarCloud bugs"></a>
	<a href="https://sonarcloud.io/summary/overall?id=BBE78_events-player"><img src="https://sonarcloud.io/api/project_badges/measure?project=BBE78_events-player&metric=coverage" alt="sonarcloud" title="SonarCloud code coverage"></a>
	<br/>
	<a href="https://github.com/BBE78/events-player/issues"><img src="https://img.shields.io/github/issues-raw/BBE78/events-player" alt="issues"></a>
	<a href="https://www.npmjs.com/package/events-player"><img src="https://img.shields.io/npm/dm/events-player" alt="npmjs"></a>
	<a href="https://www.npmjs.com/package/events-player"><img src="https://img.shields.io/github/package-json/v/BBE78/events-player" alt="GitHub package.json version"></a>
</p>

## What is `events-player`?

It is a player of time based events, such as a movie player :movie_camera: but with your events :smile:

It could be used in a browser, or in a Node.js application.

What is an "event"? An event is composed of 2 properties:
 * a `delay` (number in milliseconds): the time that the player should wait before sending the event data
 * a `data` (anything you want): the data to send uppon delay expiration

## What is not `events-player`?

It is not a job/task scheduler such as "cron", it is not supposed to be used for scheduling a job/task "every day at 8:00 AM" for example.

## Demo

Look at this [example](https://htmlpreview.github.io/?https://github.com/BBE78/events-player/blob/main/example.html) for a concrete usage

## Installation

`npm install events-player`

or

`yarn add events-player`

## Usage

The following example...

```javascript
const player = new EventsPlayer([
    { delay: 6000, data: 42 },
    { delay: 1234, data: 'hello' },                      // could be unordered
    { delay: 7000, data: { id: 1, message: 'world' } },  // could be your own data
    { delay: 7600, data: true }
], (data) => {
    console.info('data:', data);
});
player.on('state', (newState, previousState) => {
    console.info('state:', previousState, '-->', newState);
});
player.start();
...
player.pause();		// after 6000 ms.
...
player.resume();	// after 5 sec.
```

...will produce the following console output:

```
state: initialised --> started
data: hello
data: 42
state: started --> paused
state: paused --> resumed
data: { id: 1, message: 'world' }
data: true
state: resumed --> done
```

...and with a timeline representation:

<pre>
actions:     start()              pause()      resume()
             |                    |            |
timeline:  --X---O-------------O---  (5 sec.)  ---------------O-----OX--->
             |   |             |  |            |              |     ||
callback:    |   'hello'       42 | { id: 1, message: 'world' }     true
             |                    |            |                     |
state:       'started'            'paused'     'resumed'             'done'
</pre>

## API

### Properties

| Name                  | Type      | Description |
| --------------------- | --------- | ----------- |
| `speed`               | `number`  | the player speed |

### Events

| Name                  | Type      | Default   | Description |
| --------------------- | --------- | --------- | ----------- |
| `state`               | `"initialized"|"started"|"paused"|"resumed"|"done"`  | `"initialized"`                            | on player's state changed |
| `speed`               | `number`  | `1`       | on speed changed |
| `started`             | `-`       | `-`       | on player started |
| `paused`              | `-`       | `-`       | on player paused |
| `resumed`             | `-`       | `-`       | on player resumed |
| `stopped`             | `-`       | `-`       | on player stopped |
| `done`                | `-`       | `-`       | on player done |

### Methods

| Name                  | Arg       | Default   | Description |
| --------------------- | --------- | --------- | ----------- |
| `start(speed)`        | `number`  | `1`       | start the player |
| `pause()`             | `-`       | `-`       | pause the player |
| `resume()`            | `-`       | `-`       | resume the player |
| `stop()`              | `-`       | `-`       | stop the player |


## Issues & Enhancements

![GitHub issues](https://img.shields.io/github/issues-raw/BBE78/events-player)
![GitHub issues](https://img.shields.io/github/issues-closed-raw/BBE78/events-player)

For any bugs, enhancements, or just questions feel free to use the [GitHub Issues](https://github.com/BBE78/events-player/issues)

## Licence

[![license](https://img.shields.io/badge/license-MIT-green.svg)](/LICENSE)

This project is licensed under the terms of the [MIT license](/LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBBE78%2Fevents-player.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FBBE78%2Fevents-player?ref=badge_large)

