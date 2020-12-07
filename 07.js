const Advent = new (require('./index.js'))(7, 2020);

async function Run() {
    const input = await Advent.GetInput();

    const bagMap = {};
    const bags = input.map((i) => {
        const regBagInput = /^([a-z ]+?) bag/;
        const inputBag = regBagInput.exec(i);
        const reg = /(\d+) ([a-z ]+) bags?/g;
        const bags = [];
        let match;
        while(match = reg.exec(i)) bags.push({
            num: Number(match[1]),
            name: match[2],
        });
        const bag = {
            name: inputBag[1],
            bags: bags,
        };
        bagMap[inputBag[1]] = bag;
        return bag;
    });
    // add child bags to each bag
    bags.forEach((bag) => {
        bag.bags.forEach((child) => {
            child.bag = bagMap[child.name];
            delete child.name;
        });
    });

    // return all bags containing the supplied bag name
    const bagsContaining = (bagName) => {
        const doesContain = (bag) => {
            // do any of our (recursive) children contain bagName?
            if (bag.name === bagName) return true;
            const childBags = bag.bags.find((x) => {
                return doesContain(x.bag);
            });
            return !!childBags;
        };
        return bags.filter((x) => x.name !== bagName).filter(doesContain);
    };
    const shinyGoldContainers = bagsContaining('shiny gold');

    await Advent.Submit(shinyGoldContainers.length);

    const childBags = (bag) => {
        return bag.bags.reduce((p, x) => {
            return p + (childBags(x.bag) * x.num);
        }, 1);
    };

    await Advent.Submit(childBags(bagMap['shiny gold']) - 1, 2);
}
Run();
