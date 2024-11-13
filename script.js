const bar = document.querySelector("div#bar");
const write = document.querySelector("textarea#write");
const words = document.querySelector("div#words");
const wiped = "🔥";

// clear default text on focus, restore on blur
write.onfocus = (event) => {
	if (write.value == write.defaultValue || write.value == wiped) {
		write.value = "";
	}
}
write.onblur = (event) => {
	if (write.value == "") {
		write.value = write.defaultValue;
	}
}

// wipe text when keypress timer counts down
const maxWriteIdle = 10;
var writeIdle = -1;
var abandoner = null; 
function abandon() {
	writeIdle++;
	bar.style.width = (100-(writeIdle/maxWriteIdle*100)) + "%";
	if (writeIdle >= maxWriteIdle) {
		words.innerHTML = "";
		write.value = wiped;
		write.blur();
		clearInterval(abandoner);
		abandoner = null;
	}
}

// word count
function count() {
	let spaces = /\s+/;
	let tidy = write.value.trim().split(spaces);
	return tidy.length
}

// when typing, reset idle, count words, ensure abandoner is running
write.oninput = (event) => {
	writeIdle = -1;
	words.innerHTML = count() + " words";
	if (abandoner == null) {
		abandon();
		abandoner = setInterval(abandon, 1000);
	}
}
