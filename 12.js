const Advent = new (require('./index.js'))(12, 2020);

class Turtle {
    constructor() {
        this.pos = [0, 0];
        this.dirs = ['E', 'S', 'W', 'N'];
        this.dir = 0;
    }

    Move(str) {
        const dir = str[0];
        const val = Number(str.slice(1));
        this[`Move_${dir}`](val);
    }

    Move_N(val) {
        this.pos[1] -= val;
    }
    Move_S(val) {
        this.pos[1] += val;
    }
    Move_E(val) {
        this.pos[0] += val;
    }
    Move_W(val) {
        this.pos[0] -= val;
    }
    Move_L(val) {
        this.Turn(-Math.floor(val/90));
    }
    Move_R(val) {
        this.Turn(Math.floor(val/90));
    }
    Move_F(val) {
        this[`Move_${this.dirs[this.dir]}`](val);
    }
    Turn(turns) {
        this.dir = (((this.dir + turns) % 4) + 4) % 4;
    }
    Distance() {
        return Math.abs(this.pos[0]) + Math.abs(this.pos[1]);
    }
};

async function Run() {
    const input = await Advent.GetInput();
    const input2 = `F10
N3
F7
R90
F11
L90
L180
R270
R90
R180
L90
F1`.split(/\n/g);

    const map = new Turtle();
    input.forEach((i) => {
        map.Move(i);
    });
    await Advent.Submit(map.Distance());

    // await Advent.Submit(null, 2);
}
Run();
