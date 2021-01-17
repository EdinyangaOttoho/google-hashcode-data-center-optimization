var f = require("fs");

var input_file = f.readFileSync("B.txt", "utf-8").split("\n");

var params = input_file[0].split(" ");

var rows = parseInt(params[0]);
var slots = parseInt(params[1]);
var unavailable = parseInt(params[2]);
var pools = parseInt(params[3]);
var servers = parseInt(params[4]);

var schema = Array.from({length:rows}, ()=>Array.from({length:slots}, ()=>1));

for (let i = 1; i <= unavailable; i++) {
	let _a = input_file[i].split(" ");
	let x = parseInt(_a[0]);
	let y = parseInt(_a[1]);
	schema[x][y] = 0;
}

let j = 0;
var server_assoc = [];

for (let i = (1+unavailable); i < input_file.length; i++) {
	let a_ = input_file[i].split(" ");
	let slots = parseInt(a_[0]);
	let capacity = parseInt(a_[1]);
	let mult = (slots * capacity);
	server_assoc.push([j, mult, slots, capacity]);
	j++;
}
server_assoc = server_assoc.sort((a, b)=>{
	return b[1] - a[1];
});

function getallslots(x) {
	for (let i in schema) {
		let _a = schema[i].join('');
		let re = new RegExp('1{'+x+'}');
		let match = _a.match(re);
		if (match != null) {
			return [parseInt(i), match.index];
			break;
		}
	}
	return -1;
}
function fillslots(x, y, z) {
	for (let i = y; i < (y + z); i++) {
		schema[x][i] = 0;
	}
}

let output = [];

let which_pool = 0;

console.log("Allocating servers...");

let scanned = 0;
let unscanned = 0;

for (let i = 0; i < server_assoc.length; i++) {

	let fill = server_assoc[i][2];
	let capacity = server_assoc[i][3];

	let which_slot = getallslots(fill);
	if (which_slot != -1) {
		output.push([server_assoc[i][0], which_slot[0], which_slot[1], which_pool]);
		fillslots(which_slot[0], which_slot[1], fill);
		scanned++;
	}
	else {
		output.push([server_assoc[i][0], 'x']);
		unscanned++;
	}
	which_pool++;
	if (which_pool == pools) {
		which_pool = 0;
	}
}

console.log("Done...");
console.log("Total servers: "+server_assoc.length);
console.log("Allocated servers: "+scanned);
console.log("Unallocated servers: "+unscanned);

let result = output.sort(function(a, b) {
	return a[0] - b[0];
}).map(function(x) {
	if (x.length == 2) {
		return x[1];
	}
	else {
		return [x[1], x[2], x[3]].join(" ");
	}
});
f.writeFileSync("B_0.txt", result.join("\n"));