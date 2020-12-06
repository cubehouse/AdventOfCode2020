const Advent = new (require('./index.js'))(6, 2020);

async function Run() {
    const input = await Advent.GetInput();

    const groups = input.reduce((p, x) => {
        if (x === '') {
            p.push({forms: []});
        } else {
            p[p.length-1].forms.push(x);
        }
        return p;
    }, [{forms: []}]);

    groups.forEach((group) => {
        group.questions = Array.from(new Set(group.forms.join('').split('')));
        group.questions.sort();
    });

    await Advent.Submit(groups.reduce((p, x) => {
        return p + x.questions.length;
    }, 0));

    groups.forEach((group) => {
        group.allAns = group.questions.filter((x) => {
            return !group.forms.find((n) => {
                return n.indexOf(x) < 0;
            });
        });
    });
    await Advent.Submit(groups.reduce((p, x) => {
        return p + x.allAns.length;
    }, 0), 2);
}
Run();
