const EventsPlayer = require('./index');

const player = new EventsPlayer([
    { delay: 1000, data: 'data #2' },
    { delay:  500, data: 'data #1' },
    { delay: 2000, data: 'data #3' },
    { delay: 4000, data: 'data #4' }
], (data) => {
    console.info('event:', data);
});

player.on('state', (newState, previousState) => {
    console.info('state:', previousState, '-->', newState);
});

setTimeout(() => { player.pause()}, 700);
setTimeout(() => { player.resume()}, 5000);
setTimeout(() => { player.stop()}, 7000);
setTimeout(() => { player.start()}, 8000);

player.start();
