/******************************************************************************
 *
 * Copyright (c) 2022 - BBe78
 *
 *****************************************************************************/

import EventsPlayer  from '../index';

/** An empty function. */
const emptyCallback = () => { /* does nothing */ };

/** Safely stop the player. */
const stopPlayer = (player) => {
    if (player) {
        player.stop();
    }
};

describe('Testing EventsPlayer class', () => {

    const quickEvents = [
        { delay: 100, data: 'data #1'}
    ];

    describe('constructor', () => {
        test('nominal', () => {
            const player = new EventsPlayer(quickEvents, emptyCallback);
            expect(player).toBeDefined();
        });

        test('with 2 events already sorted', () => {
            const player = new EventsPlayer([
                { delay: 2 },
                { delay: 5 }
            ], emptyCallback);
            expect(player).toBeDefined();
        });

        test('with 2 events not sorted', () => {
            const player = new EventsPlayer([
                { delay: 5 },
                { delay: 2 }
            ], emptyCallback);
            expect(player).toBeDefined();
        });

        test('without parameters', () => {
            expect(() => new EventsPlayer()).toThrow(Error);
        });

        test('with non array events', () => {
            expect(() => new EventsPlayer(2)).toThrow(Error);
            expect(() => new EventsPlayer(1.1)).toThrow(Error);
            expect(() => new EventsPlayer(true)).toThrow(Error);
            expect(() => new EventsPlayer(false)).toThrow(Error);
            expect(() => new EventsPlayer('')).toThrow(Error);
            expect(() => new EventsPlayer('dummy')).toThrow(Error);
        });

        test('with empty events array', () => {
            expect(() => new EventsPlayer([])).toThrow(Error);
        });

        test('without callback', () => {
            expect(() => new EventsPlayer(quickEvents)).toThrow(Error);
        });

        test('with non function callback', () => {
            expect(() => new EventsPlayer(quickEvents, 2)).toThrow(Error);
            expect(() => new EventsPlayer(quickEvents, 1.1)).toThrow(Error);
            expect(() => new EventsPlayer(quickEvents, true)).toThrow(Error);
            expect(() => new EventsPlayer(quickEvents, false)).toThrow(Error);
            expect(() => new EventsPlayer(quickEvents, '')).toThrow(Error);
            expect(() => new EventsPlayer(quickEvents, 'dummy')).toThrow(Error);
        });

        test('with null speed', () => {
            expect(() => new EventsPlayer(quickEvents, emptyCallback, null)).toThrow(Error);
        });

        test('with non number speed', () => {
            expect(() => new EventsPlayer(quickEvents, emptyCallback, 'hello')).toThrow(Error);
        });

        test('with lower that 0 speed', () => {
            expect(() => new EventsPlayer(quickEvents, emptyCallback, 0)).toThrow(Error);
            expect(() => new EventsPlayer(quickEvents, emptyCallback, -1)).toThrow(Error);
        });

    });

    describe('start()', () => {

        let player;

        afterEach(() => {
            stopPlayer(player);
        });

        test('nominal', (done) => {
            player = new EventsPlayer(quickEvents, () => {
                done();
            });
            player.start();
        });

        test('with "start()" called multiples times', (done) => {
            let count = 0;
            player = new EventsPlayer(quickEvents, () => {
                count++;
            });
            player.on('done', () => {
                if (count === 1) {
                    done();
                } else {
                    done(`events callback should be called only once, but was called ${count} times`);
                }
            })
            player.start();
            player.start();
            player.start();
        });

    });

    describe('pause()', () => {

        let player;

        afterEach(() => {
            if (player) {
                player.stop();
                player = undefined;
            }
        });

        test('nominal', (done) => {
            player = new EventsPlayer(quickEvents, emptyCallback);
            player.on('paused', () => {
                done();
            });
            player.start();
            player.pause();
        });

    });

    describe('speed()', () => {

        let player;

        afterEach(() => {
            stopPlayer(player);
        });

        test('nominal', (done) => {
            player = new EventsPlayer(quickEvents, emptyCallback);
            player.on('speed', (newValue, oldValue) => {
                expect(newValue).toBe(2.2);
                expect(oldValue).toBe(1);
                done();
            });
            player.speed = 2.2;
        });

        test('while playing', (done) => {
            player = new EventsPlayer(quickEvents, emptyCallback);
            player.on('speed', (newValue, oldValue) => {
                expect(newValue).toBe(2.2);
                expect(oldValue).toBe(1);
                done();
            });
            player.start();
            player.speed = 2.2;
        });

    });

    describe('listeners', () => {

        const listenersTestTimeout = 1000;
        let player;

        beforeEach(() => {
            player = new EventsPlayer(quickEvents, emptyCallback);
        });

        afterEach(() => {
            stopPlayer(player);
        });

        test('without listener', () => {
            player.on('state');
            player.on('speed');
            player.on('started');
            player.on('paused');
            player.on('resumed');
            player.on('stopped');
            player.on('done');
        });

        test('"done" event', (done) => {
            player.on('done', () => {
                done();
            });
            player.start();
        }, listenersTestTimeout);

        test('"speed" event', (done) => {
            player.on('speed', () => {
                done();
            });
            player.speed = 2;
        }, listenersTestTimeout);

        describe('"started" event', () => {
            test('nominal', (done) => {
                player.on('started', () => {
                    done();
                });
                player.start();
            }, listenersTestTimeout);
            test('with "start()" multiple times', (done) => {
                let count = 0;
                player.on('done', () => {
                    if (count !== 1) {
                        done(`"started" event should be call only once, but was called ${count} times`);
                    } else {
                        done();
                    }
                });
                player.on('started', () => {
                    count++;
                });
                player.start();
                player.start();
            }, listenersTestTimeout);
        });

        describe('"paused" event', () => {
            test('nominal', (done) => {
                player.on('paused', () => {
                    done();
                });
                player.start();
                player.pause();
            }, listenersTestTimeout);
            test('without "start()" being called', (done) => {
                player.on('paused', () => {
                    done('"paused" event should not be notified when not "started"')
                });
                player.pause();
                done();
            }, listenersTestTimeout);
        });

        describe('"resumed" event', () => {
            test('nominal', (done) => {
                player.on('resumed', () => {
                    done();
                });
                player.start();
                player.pause();
                player.resume();
            }, listenersTestTimeout);
            test('without "start()" being called', (done) => {
                player.on('resumed', () => {
                    done('"resumed" event should not be notified when not "started"')
                });
                player.resume();
                done();
            }, listenersTestTimeout);
            test('without "pause()" being called', (done) => {
                player.on('resumed', () => {
                    done('"resumed" event should not be notified when not "paused"')
                });
                player.start();
                player.resume();
                done();
            }, listenersTestTimeout);
        });

        describe('"stopped" event', () => {
            test('nominal', (done) => {
                player.on('stopped', () => {
                    done();
                });
                player.start();
                player.stop();
            }, listenersTestTimeout);
            test('without "start()" being called', (done) => {
                player.on('stopped', () => {
                    done();
                });
                player.stop();
            }, listenersTestTimeout);
        });

    });

    describe('accuracy', () => {

        const authorizedDeltaInMs = 30;

        test(`testing player accuracy with a dela of ${authorizedDeltaInMs} ms`, (done) => {
            const player = new EventsPlayer([
                { delay: 100, data: '#1'},
                { delay: 566, data: '#2'},
                { delay: 3198, data: '#3'}
            ], (data) => {
                const duration = Date.now() - startTime;
                switch (data) {
                    case '#1':
                        expect(duration).toBeWithin(100, 100 + authorizedDeltaInMs);
                        break;
                    case '#2':
                        expect(duration).toBeWithin(556, 556 + authorizedDeltaInMs);
                        break;
                    case '#3':
                        expect(duration).toBeWithin(3198, 3198 + authorizedDeltaInMs);
                        break;
                    default:
                        done(`untested event data: ${data}`);
                        break;
                }
            });
            player.on('done', () => {
                done();
            })
            const startTime = Date.now();
            player.start();
        })

    });

});
