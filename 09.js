const Advent = new (require('./index.js'))(9, 2020);

async function Run() {
    const input = (await Advent.GetInput()).map(Number);
    const input2 = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`.split(/\n/g).map(Number);

    const findInvalidEntry = (arr, preambleSize) => {
        for(let idx=preambleSize; idx<arr.length; idx++) {
            const nums = arr.slice(idx-preambleSize, idx);
            const val = arr[idx];
            const searches = nums.map((x) => val - x).filter((x, idx) => x !== nums[idx] && x > 0).filter((x, arr) => {
                return nums.indexOf(x) >= 0;
            });
            if (searches.length === 0) {
                return val;
            }
        }
        return undefined;
    };

    const invalidNum = findInvalidEntry(input, 25);
    await Advent.Submit(invalidNum);

    const findSummer = (arr, target) => {
        for(let idx=0; idx<arr.length; idx++) {
            let sum = arr[idx];
            let end = idx+1;
            for(; end<arr.length && sum < target; end++) {
                sum += arr[end];
            }
            if (sum === target) {
                return arr.slice(idx, end);
            }
        }
        return undefined;
    };
    const components = findSummer(input, invalidNum);

    await Advent.Submit(Math.min(...components) + Math.max(...components), 2);
}
Run();
