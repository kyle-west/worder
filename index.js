#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const words = require('./five-letter-words.json');
const { name, description, version } = require('./package.json');

function search ({ pattern, startsWith, endsWith, yes, no }) {
  const matcher = new RegExp(pattern?.toLowerCase().replace(/_/g, '.'));
  let focused = pattern ? words.filter(w => matcher.test(w)) : words;
  if (startsWith) {
    focused = focused.filter(w => w.startsWith(startsWith.toLowerCase()));
  }
  if (endsWith) {
    focused = focused.filter(w => w.endsWith(endsWith.toLowerCase()));
  }
  if (yes) {
    const yesChars = yes.toLowerCase().split('')
    focused = focused.filter(w => yesChars.every(c => w.includes(c)));
  }
  if (no) {
    const noChars = new RegExp(`[^${no.toLowerCase()}]{5}`);
    focused = focused.filter(w => noChars.test(w));
  }
  return focused;
}

program
  .name(name)
  .description(description)
  .version(version);

program.command('search')
  .description('List all the words that match with the given pattern')
  .argument('[pattern]', 'String Pattern. Examples: "T__ST" or a RegExp')
  .option('-y, --yes <characters>', 'what characters SHOULD appear in the word?')
  .option('-n, --no <characters>', 'what characters should NOT appear in the word?')
  .option('-s, --startsWith <wordBeginning>', 'what characters does the word start with?')
  .option('-e, --endsWith <wordEnding>', 'what characters does the word end with?')
  .action((pattern, { startsWith, endsWith, yes, no }) => console.log(search({ pattern, startsWith, endsWith, yes, no })));
  
program.parse(process.argv);

