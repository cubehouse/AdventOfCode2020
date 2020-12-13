const Advent = new (require('./index.js'))(11, 2020);
const Grid = require('./grid.js');

async function Run() {
    const input = await Advent.GetInput();
    const input2 = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`.split(/\n/g);

    const g = new Grid();
    input.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            g.Write(x, y, char);
        });
    });

    const neighbours = [
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
    ];
    const getNeighbours = (gridObj, x, y) => {
        return neighbours.map((offset) => {
            const oX = x+offset[0];
            const oY = y+offset[1];
            return {
                x: oX,
                y: oY,
                val: gridObj.Read(oX, oY),
            };
        })
    };
    const occupiedNeighbours = (gridObj, x, y) => {
        return getNeighbours(gridObj, x, y).filter((x) => x.val === '#');
    };

    const step = (gridObj) => {
        const writes = [];
        gridObj.ForEach((x, y, val) => {
            if (val === 'L') {
                const nei = occupiedNeighbours(gridObj, x, y);
                if (nei.length === 0) {
                    writes.push([x, y, '#']);
                }
            } else if (val === '#') {
                const nei = occupiedNeighbours(gridObj, x, y);
                if (nei.length >= 4) {
                    writes.push([x, y, 'L']);
                }
            }
        });
        gridObj._dirty = false;
        writes.forEach((arg) => {
            gridObj.Write(...arg);
            gridObj._dirty = true;
        });
    };

    // step until the layout doesn't change
    while(true) {
        step(g);
        if (!g._dirty) {
            break;
        }
    }

    const count = g.Map((x, y, val) => {
        return val;
    }).filter((x) => x === '#');

    await Advent.Submit(count.length);
    // await Advent.Submit(null, 2);
}
Run();
