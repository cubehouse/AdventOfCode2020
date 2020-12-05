const Advent = new (require('./index.js'))(5, 2020);

async function Run() {
    const input = await Advent.GetInput();

    // FBLR are just binary numbers, convert to binary and parse into decimal
    const IDs = input.map((x) => parseInt(x.replace(/[FL]/g, '0').replace(/[BR]/g, '1'), 2));

    // find max ID in the array
    await Advent.Submit(Math.max.apply(this, IDs));

    // sort our IDs so we can find the missing ticket
    IDs.sort((a, b) => a - b);
    const mySeat = IDs.find((x, idx, arr) => {
        // find the element in the array where the next element is +2
        //  (i.e, there is exactly 1 missing sequential ticket)
        //  this is the ticket *before* ours, so + 1
        return (arr[idx + 1] === x + 2);
    }) + 1;

    await Advent.Submit(mySeat, 2);
}
Run();
