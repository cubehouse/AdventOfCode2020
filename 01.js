const Advent = new (require('./index.js'))(1, 2020);

async function Run() {
    // part 1
    const input = (await Advent.GetInput()).map(Number);
    // search for values that combine with each entry to make 2020
    const val = input.find((x) => input.indexOf(2020 - x) >= 0);
    const ans = val * (2020 - val);
    await Advent.Submit(ans);

    // part 2
    for (let i=0; i<input.length; i++) {
        const x = input[i];
        // simlar to part 1, but we subtract our search key from 2020
        const val = input.find((y) => input.indexOf(2020 - x - y) >= 0);
        if (val) {
            await Advent.Submit(val * x * (2020 - x - val), 2);
            process.exit(0);
        }
    }
}
Run();
