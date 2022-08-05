#!/usr/bin/env node

const stream = require("stream");
const morse = require("morse");
const util = require("util");
const jsFuck = require("./jsfuck.js");
const repl = require("repl");

const map = {
  "(": "0",
  ")": "1",
  "[": "2",
  "]": "3",
  "+": "4",
  "!": "5",
};

function compile(input) {
  const fucked = jsFuck.JSFuck.encode(input);
  let mapped = fucked.split("");
  for (const character in fucked) mapped[+character] = map[fucked[+character]];
  mapped = mapped.join("");
  const script = morse.encode(mapped);
  return script;
}

if (process.argv.length !== 3) {
  function Stream() {
    stream.Transform.call(this);
  }
  util.inherits(Stream, stream.Transform);

  Stream.prototype._transform = function (chunk, encoding, callback) {
    const script = compile(chunk.toString());
    const lines = script.split(/\n+/);
    for (let i = 0; i < lines.length; i++) {
      // ignore empty lines
      if (lines[i] !== "") this.push(lines[i] + "\n");
    }
    callback();
  };

  const fuckScript = new Stream();
  repl.start({
    prompt: "FUCKMORSE> ",
    input: fuckScript,
    useColors: true,
    output: process.stdout,
  });

  process.stdin.pipe(fuckScript);
} else {
  const data = require("fs").readFileSync(process.argv[2], "utf8");
  const output = compile(data, false);
  console.log(output);
}
