// 'test' is defined but never used. (eslint @typescript-eslint/no-unused-vars)
function test() {
  // is assigned a value but never used. (eslint @typescript-eslint/no-unused-vars)
  const a = 1;
  const b = 2;
  // eslint-disable-next-line no-var
  var c = 3;
  // Unexpected console statement. (eslint no-console)
  console.log('test');
  console.warn('test');
}
