const Advent = new (require('./index.js'))(4, 2020);

async function Run() {
    const input = await Advent.GetInputRaw();

    const passports = input.toString().
        // split each passport based on double new-lines
        split(/\n\n/g).
        // squish any extra new-lines into a single string for each passport
        map(
            (x) => x.replace(/\n/g, ' ')
        ).
        map((x) => {
            return x.split(/\s/g).map((y) => y.split(':'))
        }).
        // convert each passport into an object of field->value
        map((x) => {
            const obj = {};
            x.forEach((kvp) => {
                obj[kvp[0]] = kvp[1];
            });
            return obj;
        })
    ;

    // fields that must exist for a passport to be valid
    const requiredFields = `byr
iyr
eyr
hgt
hcl
ecl
pid`.split(/\n/);
    const hasAllFields = passports.filter((passport) => {
        const fields = Object.keys(passport);
        if (requiredFields.find((f) => fields.indexOf(f) < 0)) {
            return false;
        }
        return true;
    });

    await Advent.Submit(hasAllFields.length);

    // field validators
    const validators = {
        byr: (x) => {
            const year = Number(x);
            return (year >= 1920 && year <= 2002);
        },
        iyr: (x) => {
            const year = Number(x);
            return (year >= 2010 && year <= 2020);
        },
        eyr: (x) => {
            const year = Number(x);
            return (year >= 2020 && year <= 2030);
        },
        hgt: (x) => {
            const match = /^(\d+)(cm|in)$/.exec(x);
            if (!match) return false;
            const val = Number(match[1]);
            if (match[2] === 'cm') {
                return val >= 150 && val <= 193;
            }
            return val >= 59 && val <= 76;
        },
        hcl: (x) => {
            return /^#[0-9a-f]{6}$/.test(x);
        },
        ecl: (x) => {
            return /^(?:amb|blu|brn|gry|grn|hzl|oth)$/.test(x);
        },
        pid: (x) => {
            return /^\d{9}$/.test(x);
        },
    };

    const validatePassport = (passport) => {
        // validate we have all our fields
        const fields = Object.keys(passport);
        if (requiredFields.find((f) => fields.indexOf(f) < 0)) {
            return false;
        }

        // run validators over all our required fields
        if (requiredFields.find((field) => {
            // return true if we fail the validation test so our find() ends asap
            return !validators[field](passport[field]);
        })) {
            return false;
        };
        return true;
    };

    const validPassports = passports.filter(validatePassport);
    await Advent.Submit(validPassports.length, 2);
}
Run();
