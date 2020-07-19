var fs = require('fs');
var units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'
];
var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty',
    'ninety'
];

const convertTens = (num) => {
    let numString = num.toString()
    if (num === 0) return 'zero';

    if (num < 20) {
        return units[num];
    }

    if (numString.length === 2) {
        return tens[numString[0]] + ' ' + units[numString[1]];
    }
}

const convertHundreds = (num) => {
    let numString = num.toString()
    if (num === 0) return 'zero';
    if (numString.length <= 2) return convertTens(num);
    if (numString.length == 3) {
        if (numString[1] === '0' && numString[2] === '0')
            return units[numString[0]] + ' hundred ';
        else
            return units[numString[0]] + ' hundred and ' + convertTens(+(numString[1] + numString[2]));
    }
}

const convertThousands = (num) => {
    let numString = num.toString()
    if (num === 0) return 'zero';
    if (numString.length <= 3) return convertHundreds(num);
    if (numString.length === 4) {
        var end = +(toNumber(numString.slice(1).split('')));
        if (end === 0) return numString[b[0]] + ' thousand ';
        if (end < 100) return numString[b[0]] + ' thousand and ' + convertHundreds(end);
        return numString[b[0]] + ' thousand ' + convertHundreds(end);
    }
}
const convertHundredOfThousands = (num) => {
    let numString = num.toString()
    if (numString.length < 5) {
        return convertThousands(num);
    }
    if (numString.length === 5) {
        let tens = convertTens(toNumber(numString.slice(0, 2).split('')));
        var end = +(toNumber(numString.slice(2).split('')));
        return tens + ' thousands ' + convertHundreds(end);
    }
    if (numString.length === 6) {
        let hundreds = convertHundreds(toNumber(numString.slice(0, 3).split('')));
        var end = +(toNumber(numString.slice(3).split('')));
        return hundreds + ' thousands ' + convertHundreds(end);
    }
}

const toNumber = (arr) => {
    return +(arr.reduce((a, b) => a.toString() + b.toString(), ''));
}

const convert = (str) => {
    const input = str;
    let converted = input.split('');
    let invalid = false;
    let b = [];
    let signed = false;

    for (let i = 0; i < converted.length; i++) {

        if (converted[i] === " ") {
            if (b.length > 0) {
                break
            };
            if (signed) break;
            continue;
        }
        if (converted[i] === "+") {
            if (buffer.length > 0) break;

            if (signed) break;
            signed = true;
            continue;
        }

        let chr = parseInt(converted[i]);

        if (!isNaN(chr)) {
            b.push(chr);
        } else {
            continue;
        }
    }

    if (b.length === 0) return '0';
    if (invalid) return 'number invalid';

    let num = b[b.length - 1];
    let multiplier = 10;
    for (let j = b.length - 2; j >= 0; j--) {
        num += b[j] * multiplier;
        multiplier *= 10;
    };

    if (b.length <= 2) return convertTens(num);

    //100 and more
    if (b.length == 3) {
        if (b[1] === '0' && b[2] === '0')
            return units[b[0]] + ' hundred';
        else
            return units[b[0]] + ' hundred and ' + convertTens(toNumber(b.slice(1, 3)));
    }

    if (b.length === 4) {
        var end = +(toNumber(b.slice(1)));
        if (end === 0) return units[b[0]] + ' thousand';
        if (end < 100) return units[b[0]] + ' thousand and ' + convertHundreds(end);
        return units[b[0]] + ' thousand ' + convertHundreds(end);
    }

    if (b.length === 5) {
        let tens = convertTens(toNumber(b.slice(0, 2)));
        var end = +(toNumber(b.slice(2)));
        return tens + ' thousands ' + convertHundreds(end);
    }

    if (b.length === 6) {
        let hundreds = convertHundreds(toNumber(b.slice(0, 3)));
        var end = +(toNumber(b.slice(3)));
        return hundreds + ' thousands ' + convertHundreds(end);
    }

    if (b.length === 7) {
        var end = +(toNumber(b.slice(1)));
        if (end === 0) return units[b[0]] + ' million';
        if (end < 100000) return units[b[0]] + ' million and ' + convertThousands(end);
        return units[b[0]] + ' million ' + convertHundredOfThousands(end);
    }

    return num.toString();
}

fs.readFile('test-file.txt', 'utf8', function(err, data) {
    if (err) throw err;

    if (data) {
        let processed = convert(data);
        process.stdout.write(processed);
    }
});