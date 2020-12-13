const Advent = new (require('./index.js'))(13, 2020);

async function Run() {
    const input = await Advent.GetInput();

    const start = Number(input[0]);
    const buses = input[1].split(',').filter((x) => x !== 'x').map(Number);

    const waitTime = buses.map((x) => {
        // divide our arrival time by bus frequency, getting the remainer (%)
        //  then remove this from the bus frequency to get the next arrival time
        return x - (start % x);
    });
    const nextBus = waitTime.indexOf(Math.min(...waitTime));

    await Advent.Submit(waitTime[nextBus] * buses[nextBus]);
    // await Advent.Submit(null, 2);
}
Run();
