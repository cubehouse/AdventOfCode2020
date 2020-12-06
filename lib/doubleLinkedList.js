
/**
 * Cyclical double linked list
 * Can move the head element forward and back
 * Can insert elements at the head of tail of the list
 * Suppots array-style access and length property
 */
class DoubleLinkedList {
    constructor(firstNode) {
        this.head = {
            body: firstNode,
        };
        this.head.next = this.head;
        this.head.prev = this.head;

        this.length = 1;

        // return a proxy object so we can perform array style operations
        return new Proxy(this, {
            get: (target, prop) => {
                const propNumber = Number(prop);
                if (!isNaN(propNumber)) {
                    const indexToFind = (propNumber + this.length) % this.length;
                    let x=target.head, idx=0;
                    for(; idx < indexToFind; x=x.next, idx++) {}
                    return x.body;
                }
                return target[prop];
            },
        });
    }

    /**
     * Add object to tail of list
     * @param {*} obj 
     */
    push(obj) {
        const newObj = {
            body: obj,
            next: this.head,
            prev: this.head.prev,
        };

        this.head.prev.next = newObj;
        this.head.prev = newObj;

        this.length++;

        return newObj;
    }

    /**
     * Add object as head of the list
     * @param {*} obj 
     */
    unshift(obj) {
        this.head = {
            body: obj,
            next: this.head,
            prev: this.head.prev,
        };
        this.head.next.prev = this.head;
        this.head.prev.next = this.head;
        
        this.length++;

        return this.head;
    }

    /**
     * Remove element from head of list (and return it)
     */
    shift() {
        const oldObj = this.head;

        oldObj.prev.next = oldObj.next;
        oldObj.next.prev = oldObj.prev;

        this.length--;

        return oldObj.body;
    }

    /**
     * Remove element from tail of list (and return it)
     */
    pop() {
        // rotate ourselves backwards and call shift()
        this.head = this.head.prev;
        const oldObj = this.shift();
        this.head = this.head.next;
        return oldObj;
    }

    moveHead(num) {
        if (num < 0) return this.moveHeadBackward(-num);

        for(let i=0; i<num; i++) {
            this.head = this.head.next;
        }
    }

    moveHeadBackward(num) {
        for(let i=0; i<num; i++) {
            this.head = this.head.prev;
        }
    }

    forEach(cb) {
        for(let x=this.head, idx=0; x != this.head || idx===0; x=x.next, idx++) {
            cb(x.body, x, idx);
        }
    }
};

module.exports = DoubleLinkedList;

if (!module.parent) {
    // start list with an initial element
    const list = new DoubleLinkedList(1);
    // replace head with new element
    list.unshift(0);
    // also has shift() to remove and return head element

    // add to end of list (also has pop())
    list.push(2);
    // note: push and unshift will both return the newly created list object

    // list is now 0, 1, 2

    // move the linked list head by 1 place (forwards)
    list.moveHead(1);
    // also moveHeadBackwards(x) to go the other way
    // list is now 1, 2, 0

    // forEach convenience function to help debug lists
    list.forEach((x, el, idx) => {
        console.log(`[${idx}] ${el.body} -> ${el.next.body}`);
    });

    // can also access the list like an array
    //  this is O(n) as it has to traverse through the whole list until it finds n
    //  not a real array accessor! Pretend proxy object for convenience
    // if you want to loop, traverse through .next pointers yourself, usually faster
    // also, it loops!
    console.log(`Arr size ${list.length}, [-1]=${list[-1]}, [0]=${list[0]}, [1]=${list[1]}, [2]=${list[2]}, [3]=${list[3]}`);
}
