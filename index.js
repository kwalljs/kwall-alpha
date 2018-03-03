try {
  require.resolve('./Kwall');
} catch (error) {
  console.error();
  console.error('[Error] Kwall (`kwall`) is not installed.');
  console.error();

  process.exit(error.code);
}

const Kwall = require('./Kwall');

(new Kwall(__dirname)).initialize((err, port) => {
  if (err) {
    console.error(err.stack);
    process.exit(err.code);
  }
  
  console.log(`[Kwall Server] Server listening at: ${port}.`);
});