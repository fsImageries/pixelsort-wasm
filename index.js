const AsBind = require("as-bind/dist/as-bind.cjs.js");

const fs = require("fs");

const wasm = fs.readFileSync("./build/untouched.wasm");

const asyncTask = async () => {
  const asBindInstance = await AsBind.instantiate(wasm);

  // You can now use your wasm / as-bind instance!

  console.log(asBindInstance.exports.test()); // AsBind: Hello World!
};
asyncTask();