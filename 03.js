const Advent = new (require('./index.js'))(3, 2020);

class Slope {
    constructor(input) {
        this.map = input;
    }

    // get a cell character on this slope
    get(x, y) {
        // return undefined if we query off the bottom of the slope
        if (y >= this.map.length) return undefined;

        // fetch slope cell by wrapping around the x position
        const row = this.map[y];
        return row[x % row.length];
    }

    // height of slope
    get height() {
        return this.map.length;
    }

    // run the main slope tree count function
    runSlope(xDiff, yDiff = 1) {
        let x = 0, trees = 0;
        // loop y until we hit the slope bottom
        for(let y = 0; y < this.height; y+=yDiff) {
            if (this.get(x, y) === '#') {
                trees++;
            }
            x += xDiff;
        }
        return trees;
    }
}

async function Run() {
    const input = await Advent.GetInput();

    const map = new Slope(input);
    const ans1 = map.runSlope(3);
    await Advent.Submit(ans1);

    const ans2 = (
        ans1 *
        map.runSlope(1) *
        map.runSlope(5) * 
        map.runSlope(7) *
        map.runSlope(1, 2)
    );
    await Advent.Submit(ans2, 2);
}
Run();
