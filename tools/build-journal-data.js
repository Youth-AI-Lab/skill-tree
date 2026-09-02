/* Extracts the shared data the journal page needs out of index.html.
 *
 * index.html stays the single source of truth for the labs, the skill titles
 * and the interface strings; this script copies just those three blocks into
 * journal-data.json so journal.html does not have to duplicate them.
 *
 * Run it after editing lab names, skill titles or translations:
 *   node tools/build-journal-data.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

/* pulls `const <name> = <literal>` out of the page by matching brackets */
function block(name) {
  const start = html.indexOf(`const ${name} = `);
  if (start < 0) throw new Error(`${name} not found in index.html`);
  const open = html.indexOf('=', start) + 1;
  const first = html.slice(open).search(/[[{]/) + open;
  const pairs = { '[': ']', '{': '}' };
  const close = pairs[html[first]];
  let depth = 0, quote = null;
  for (let i = first; i < html.length; i++) {
    const c = html[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === html[first]) depth++;
    else if (c === close && --depth === 0) {
      return eval('(' + html.slice(first, i + 1) + ')');
    }
  }
  throw new Error(`unbalanced literal for ${name}`);
}

const teams = block('teams');
const phases = block('phases');
const I18N = block('I18N');
const TRANSLATIONS = block('TRANSLATIONS');

const LANGS = Object.keys(I18N);

/* same slug rule as index.html */
function slugifyTitle(s) {
  return s.toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const skills = {};
phases.forEach(phase => phase.nodes.forEach(node => {
  const titles = {};
  LANGS.forEach(lang => {
    titles[lang] = (TRANSLATIONS[lang] && TRANSLATIONS[lang][node.title]) || node.title;
  });
  skills[slugifyTitle(node.title)] = titles;
}));

/* only the strings the journal page actually shows */
const KEYS = ['skillTree', 'recentActivity', 'fullJournalTitle', 'fullJournalSub',
              'journalValidated', 'journalStarted', 'journalEmpty', 'backToTree', 'journalEntriesWord',
              'updatedPrefix'];
const strings = {};
LANGS.forEach(lang => {
  strings[lang] = {};
  KEYS.forEach(k => { if (I18N[lang][k]) strings[lang][k] = I18N[lang][k]; });
});

const out = {
  generatedFrom: 'index.html',
  teams: teams.map(t => ({ id: t.id, name: t.name, short: t.short, country: t.country, avatar: t.avatar })),
  strings,
  skills,
};

fs.writeFileSync(path.join(root, 'journal-data.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`journal-data.json written — ${Object.keys(skills).length} skills, ${teams.length} labs, ${LANGS.join('/')}`);
