const Advent = new (require('./index.js'))(17, 2020);

async function Run() {
    const input = await Advent.GetInput();

    // await Advent.Submit(null);
    // await Advent.Submit(null, 2);
}
Run();
