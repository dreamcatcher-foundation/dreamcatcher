import { Command } from 'commander';
import readline from 'readline';

const program = new Command();

program
  .version('1.0.0')
  .description('An example CLI for demonstration purposes')
  .option('-n, --name <type>', 'Add your name')
  .option('-a, --age <type>', 'Add your age');

program.parse(process.argv);

const options = program.opts();

if (options.name) console.log(`Hello, ${options.name}!`);
if (options.age) console.log(`You are ${options.age} years old.`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

console.log('Interactive CLI started. Type a command or "exit" to quit.');

rl.prompt();

rl.on('line', (line) => {
  const input = line.trim().split(' ');
  const command = input[0];
  const args = input.slice(1);

  switch (command) {
    case 'greet':
      if (args.length > 0) {
        console.log(`Hello, ${args.join(' ')}!`);
      } else {
        console.log('Please provide a name.');
      }
      break;
    case 'exit':
      rl.close();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      break;
  }

  rl.prompt();
}).on('close', () => {
  console.log('CLI application exited.');
  process.exit(0);
});
