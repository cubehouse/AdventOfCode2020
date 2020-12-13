const Advent = new (require('./index.js'))(11, 2020);
const Grid = require('./grid.js');

async function Run() {
    const input = await Advent.GetInput();

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
    const occupiedNeighbours = (gridObj, x, y, nFunc) => {
        return nFunc(gridObj, x, y).filter((x) => x.val === '#');
    };

    const step = (gridObj, nFunc, seatThreshold = 4) => {
        const writes = [];
        gridObj.ForEach((x, y, val) => {
            if (val === 'L') {
                const nei = occupiedNeighbours(gridObj, x, y, nFunc);
                if (nei.length === 0) {
                    writes.push([x, y, '#']);
                }
            } else if (val === '#') {
                const nei = occupiedNeighbours(gridObj, x, y, nFunc);
                if (nei.length >= seatThreshold) {
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
        step(g, getNeighbours);
        if (!g._dirty) {
            break;
        }
    }

    const count = g.Map((x, y, val) => {
        return val;
    }).filter((x) => x === '#');

    await Advent.Submit(count.length);

    // part 2

    const g2 = new Grid();
    input.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            g2.Write(x, y, char);
        });
    });

    const getSeatsInEyeline = (gridObj, x, y) => {
        return neighbours.map((dir) => {
            return gridObj.Trace(x, y, dir[0], dir[1], (x, y, val) => {
                // continue trace while we're hitting floor, otherwise stop
                return val === '.';
            });
        }).filter((t) => t[2] !== undefined).map((x) => {
            return {
                x: x[0],
                y: x[1],
                val: x[2],
            };
        });
    };

    while(true) {
        step(g2, getSeatsInEyeline, 5);
        if (!g2._dirty) {
            break;
        }
    }
    const count2 = g2.Map((x, y, val) => {
        return val;
    }).filter((x) => x === '#');

    await Advent.Submit(count2.length, 2);
}
Run();
