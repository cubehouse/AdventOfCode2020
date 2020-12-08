const EventEmitter = require('events');
const Advent = new (require('./index.js'))(8, 2020);

class Computer extends EventEmitter {
    constructor() {
        super();

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
            curPC.op.call(this, curPC.val);
            this.emit('onPostStep', curPC, this);
        }
    }
}

async function Run() {
    const input = await Advent.GetInput();

    const PC = new Computer();
    input.forEach((i) => PC.addInstruction(i));

    // after each step, overwrite the function so we can detect when we hit a loop
    PC.on('onPostStep', (instr) => {
        instr.op = () => {
            PC.PC = null;
        };
    });

    await PC.run();
    await Advent.Submit(PC.accumulator);
    
    // await Advent.Submit(null, 2);
}
Run();
