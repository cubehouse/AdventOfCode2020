const Advent = new (require('./index.js'))(5, 2020);

async function Run() {
    const input = await Advent.GetInput();

    // FBLR are just binary numbers, convert to binary and parse into decimal
    const IDs = input.map((x) => parseInt(x.replace(/[FL]/g, '0').replace(/[BR]/g, '1'), 2));

    // find max ID in the array
    await Advent.Submit(Math.max.apply(this, IDs));
    
    // await Advent.Submit(null, 2);
}
Run();
