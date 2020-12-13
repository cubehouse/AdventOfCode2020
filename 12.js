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

class Turtle2 extends Turtle {
    constructor() {
        super();
        this.waypoint = [10, -1];
    }
    Move_N(val) {
        this.waypoint[1] -= val;
    }
    Move_S(val) {
        this.waypoint[1] += val;
    }
    Move_E(val) {
        this.waypoint[0] += val;
    }
    Move_W(val) {
        this.waypoint[0] -= val;
    }
    Move_F(val) {
        const dX = this.waypoint[0] * val;
        const dY = this.waypoint[1] * val;
        this.pos[0] += dX;
        this.pos[1] += dY;
    }
    Turn(turns) {
        if (turns < 0) {
            turns = (turns % 4) + 4;
        }
        for(let i=0; i<turns; i++) {
            [this.waypoint[0], this.waypoint[1]] = [-this.waypoint[1], this.waypoint[0]];
        }
    }
}

async function Run() {
    const input = await Advent.GetInput();

    const map = new Turtle();
    input.forEach((i) => {
        map.Move(i);
    });
    await Advent.Submit(map.Distance());

    const map2 = new Turtle2();
    input.forEach((i) => {
        map2.Move(i);
    });
    await Advent.Submit(map2.Distance(), 2);
}
Run();
