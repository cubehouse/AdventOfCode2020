const Advent = new (require('./index.js'))(2, 2020);

async function Run() {
    const input = await Advent.GetInput();

    const reg = /(\d+)-(\d+)\s(\w):\s(\w+)/;
    // map all inputs to the regex match result
    const pws = input.map((x) => reg.exec(x)).filter((x) => !!x).map((x) => {
        // format the regex captures neatly for easier access later
        return {
            password: x[4],
            min: Number(x[1]),
            max: Number(x[2]),
            char: x[3],
        };
    });
    
    // filter out all pws that don't match rule
    await Advent.Submit(pws.filter((x) => {
        // quick trick to count characters in JS, split by character and count array size
        //  quick in terms of time-to-write, this whole 2 parter runs in < 100ms, so I'm not worried right now
        const num = x.password.split(x.char).length - 1;
        return num >= x.min && num <= x.max;
    }).length);

    const pws2 = pws.filter((x) => {
        // quick rough XOR, grab if the first and second char is correct and test
        const posA = x.password[x.min - 1] === x.char;
        const posB = x.password[x.max - 1] === x.char;
        return (posA && !posB) || (!posA && posB);
    });
    await Advent.Submit(pws2.length, 2);
}
Run();
