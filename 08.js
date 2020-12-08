const EventEmitter = require('events');
const Advent = new (require('./index.js'))(8, 2020);

class Computer extends EventEmitter {
    constructor() {
        super();

        this.entry = null;
        this.tail = null;
        this.PC = null;

        this.accumulator = 0;
    }

    op_nop() {
        this.PC = this.PC.next;
    }
    op_acc(val) {
        this.accumulator += val;
        this.PC = this.PC.next;
    }
    op_jmp(val) {
        if (val < 0) {
            for(let i=0; i>val; i--) {
                this.PC = this.PC.prev;
            }
        } else {
            for(let i=0; i<val; i++) {
                this.PC = this.PC.next;
            }
        }
    }

    addInstruction(str) {
        const match = /^(\w+)\s*([\d+-]+)$/.exec(str);
        if (match) {
            const func = this[`op_${match[1]}`];
            if (func === undefined) {
                console.error(`Unknown opcode ${match[1]}`);
                return false;
            }

            const newInstr = {
                op: func,
                opStr: match[1],
                val: Number(match[2]),
                next: null,
                prev: this.tail,
            };

            if (this.tail !== null) {
                this.tail.next = newInstr;
            } else {
                this.PC = newInstr;
                this.entry = newInstr;
            }
            this.tail = newInstr;
            return true;
        }
        return false;
    }

    async run() {
        while(this.PC !== null) {
            const curPC = this.PC;
            this.emit('onPreStep', curPC, this);
            if (this.PC !== null) {
                curPC.op.call(this, curPC.val);
                this.emit('onPostStep', curPC, this);
            }
        }
        this.emit('done', this.accumulator, this);
    }

    forEach(cb) {
        let c = this.entry;
        let idx = 0;
        while(c !== null) {
            cb(c, idx++);
            c = c.next;
        }
    }

    map(cb) {
        const arr = [];
        this.forEach((instr, idx) => {
            arr.push(cb(instr, idx));
        });
        return arr;
    }

    get(index) {
        let c = this.entry;
        let idx = 0;
        while(c !== null && idx < index) {
            c = c.next;
            idx++;
        }
        return c;
    }
}

async function Run() {
    const input = await Advent.GetInput();

    // helper function to detect loops, returns true if we looped
    const detectLoop = async (PC) => {
        let looped = false;
        PC.on('onPreStep', (instr) => {
            if (instr.visited) {
                looped = true;
                PC.PC = null;
            }
        });
        PC.on('onPostStep', (instr) => {
            instr.visited = true;
        });
        await PC.run();
        return looped;
    };

    const PC = new Computer();
    input.forEach((i) => PC.addInstruction(i));

    // after each step, overwrite the function so we can detect when we hit a loop
    await detectLoop(PC);
    await Advent.Submit(PC.accumulator);

    // get list of all jmp and nop instructions
    const findCmds = (cmd) => {
        return PC.map((instr, idx) => {
            if (instr.opStr !== cmd) return undefined;
            return idx;
        }).filter((x) => !!x)
    }
    const jmps = findCmds('jmp').map((idx) => {
        return {idx, replace: 'nop'};
    });
    const nops = findCmds('nop').map((idx) => {
        return {idx, replace: 'jmp'};
    });
    const replacements = [
        ...jmps, ...nops,
    ];

    const runPCWithReplacement = async (replacement) => {
        // setup new PC
        const PC = new Computer();
        input.forEach((i) => PC.addInstruction(i));

        // make single op replacement
        const rOp = PC.get(replacement.idx);
        if (!rOp) return;
        rOp.op = PC[`op_${replacement.replace}`];

        const looped = await detectLoop(PC);
        if (looped) return undefined;
        return PC.accumulator;
    };

    // try each replacement option until we exit properly
    for(let i=0; i<replacements.length; i++) {
        const res = await runPCWithReplacement(replacements[i]);
        if (res !== undefined) {
            // found a non-looping program!
            await Advent.Submit(res, 2);
            break;
        }
    }
}
Run();
