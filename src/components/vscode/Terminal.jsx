import React, { useEffect, useRef, useState } from 'react';
import files from '../../content/files';

const EMAIL = 'nesara.hippla@gmail.com';
const GITHUB = 'https://github.com/rORrEtboLt';
const PATHS = Object.keys(files);

const isDir = (p) => p === '' || PATHS.some((f) => f.startsWith(`${p}/`));
const isFile = (p) => files[p] !== undefined;
const APPS = PATHS.filter((p) => files[p].type === 'app');

function resolve(cwd, arg = '') {
  if (arg === '~' || arg === '/' || arg === '~/') return '';
  const parts = arg.startsWith('/') || arg.startsWith('~/') ? [] : cwd ? cwd.split('/') : [];
  arg.replace(/^~?\//, '').split('/').forEach((seg) => {
    if (seg === '..') parts.pop();
    else if (seg && seg !== '.') parts.push(seg);
  });
  return parts.join('/');
}

function children(dir) {
  const prefix = dir ? `${dir}/` : '';
  const names = new Set();
  PATHS.filter((p) => p.startsWith(prefix)).forEach((p) => {
    const rest = p.slice(prefix.length).split('/');
    names.add(rest.length > 1 ? `${rest[0]}/` : rest[0]);
  });
  return [...names].sort((a, b) => (a.endsWith('/') === b.endsWith('/') ? a.localeCompare(b) : a.endsWith('/') ? -1 : 1));
}

const NEOFETCH_ART = `      ( (
       ) )
    ........
    |      |]
    \\      /
     \`----'`;

const COMMANDS = {
  help: 'list commands',
  ls: 'list files',
  cd: 'change directory',
  cat: 'print a file',
  open: 'open a file in the editor',
  tree: 'show every file',
  whoami: 'who is this',
  neofetch: 'system info, but it is me',
  projects: 'things I have made',
  contact: 'how to reach me',
  github: 'open my GitHub',
  play: 'run a game in the editor',
  coffee: 'brew a cup',
  'sudo hire-me': 'you know what to do',
  clear: 'clear the terminal',
};

export default function Terminal({ open }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('');
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const nextId = useRef(0);
  // Buttons printed earlier keep old closures, so read live state through refs.
  const cwdRef = useRef(cwd);
  cwdRef.current = cwd;
  const historyRef = useRef(history);
  historyRef.current = history;

  const Cmd = ({ c }) => (
    <button className="t-cmd" onClick={() => run(c)}>{c}</button>
  );
  const FileLink = ({ path, label }) => (
    <button className={isDir(path) ? 't-dir' : 't-file'} onClick={() => (isDir(path) ? run(`cd ${path}`) : open(path))}>
      {label}
    </button>
  );

  const print = (...nodes) =>
    setLines((ls) => [...ls, ...nodes.map((n) => ({ id: nextId.current++, n }))]);

  useEffect(() => {
    print(
      <span className="t-dim">Last login: {new Date().toDateString()} on ttys001</span>,
      <span>Welcome to nesara's shell. Type <Cmd c="help" /> or try <Cmd c="neofetch" /> <Cmd c="ls" /> <Cmd c="play" /> <Cmd c="sudo hire-me" /></span>
    );
    return () => setLines([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  function prompt(dir) {
    return (
      <>
        <span className="t-user">nesara@chikmaglur</span>:<span className="t-path">~{dir ? `/${dir}` : ''}</span>$
      </>
    );
  }

  function exec(raw, dir) {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const arg = args.filter((a) => !a.startsWith('-'))[0];

    switch (cmd) {
      case undefined:
      case '':
        return;
      case 'help':
        return print(
          ...Object.entries(COMMANDS).map(([c, d]) => (
            <span><Cmd c={c} />{' '.repeat(Math.max(1, 14 - c.length))}<span className="t-dim">{d}</span></span>
          ))
        );
      case 'ls': {
        const target = resolve(dir, arg || '');
        if (isFile(target)) return print(<FileLink path={target} label={target.split('/').pop()} />);
        if (!isDir(target)) return print(`ls: ${arg}: No such file or directory`);
        return print(
          <span className="t-ls">
            {children(target).map((name) => (
              <FileLink key={name} path={resolve(target, name.replace(/\/$/, ''))} label={name} />
            ))}
          </span>
        );
      }
      case 'cd': {
        const target = resolve(dir, arg || '~');
        if (isFile(target)) return print(`cd: not a directory: ${arg}`);
        if (!isDir(target)) return print(`cd: no such file or directory: ${arg}`);
        return setCwd(target);
      }
      case 'pwd':
        return print(`/home/nesara${dir ? `/${dir}` : ''}`);
      case 'cat':
      case 'less':
      case 'more': {
        if (!arg) return print(`usage: ${cmd} <file>`);
        const target = resolve(dir, arg);
        if (isDir(target)) return print(`${cmd}: ${arg}: Is a directory`);
        if (!isFile(target)) return print(`${cmd}: ${arg}: No such file or directory`);
        const f = files[target];
        if (f.type !== 'md') return print(<span>{cmd}: {arg}: binary file. try <Cmd c={`open ${target}`} /></span>);
        return print(...f.content.replace(/\n$/, '').split('\n').map((l) => l || ' '));
      }
      case 'open':
      case 'code':
      case 'vim':
      case 'vi':
      case 'nano':
      case 'emacs': {
        if (!arg) {
          return cmd === 'open'
            ? print('usage: open <file>')
            : print(`${cmd}: you're already in an editor. try "open README.md"`);
        }
        const target = resolve(dir, arg);
        if (!isFile(target)) return print(`${cmd}: ${arg}: No such file`);
        open(target);
        return print(<span className="t-dim">opened {target}</span>);
      }
      case 'tree':
        return print(
          <span className="t-dir-static">~</span>,
          ...PATHS.slice().sort().map((p) => {
            const depth = p.split('/').length - 1;
            return <span>{'│   '.repeat(depth)}├── <FileLink path={p} label={p.split('/').pop()} /></span>;
          })
        );
      case 'whoami':
        return print('nesara: programmer, farmer, builder. Chikmaglur, Karnataka, India.');
      case 'uname':
        return print('ChikmaglurOS 1.0.0-arabica #1 SMP PREEMPT_MONSOON x86_64');
      case 'neofetch':
        return print(
          <div className="t-neofetch">
            <pre className="t-art">{NEOFETCH_ART}</pre>
            <div>
              <div><span className="t-user">nesara</span>@<span className="t-user">chikmaglur</span></div>
              <div className="t-dim">-----------------</div>
              {[
                ['OS', 'Chikmaglur Linux (Western Ghats)'],
                ['Host', 'a coffee estate, Karnataka'],
                ['Shell', 'zsh-ish 0.1'],
                ['Languages', 'C, C++, TypeScript'],
                ['Hardware', 'ESP32, thermocouples, PCBs'],
                ['Building', 'AnyGarbs'],
                ['Shipped', '6 projects'],
                ['Hobbies', 'coffee, clay, timber, mud'],
                ['Dog', 'Buster (half-indie, half-dachshund)'],
                ['Contact', EMAIL],
              ].map(([k, v]) => (
                <div key={k}><span className="t-key">{k}</span>: {v}</div>
              ))}
              <div className="t-swatches">
                {['#1f1f1f', '#f14c4c', '#6a9955', '#dcdcaa', '#569cd6', '#c586c0', '#4ec9b0', '#cccccc'].map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        );
      case 'projects':
      case 'ls-projects':
        return print(
          <span>building: <FileLink path="now/anygarbs.md" label="anygarbs" /></span>,
          <span>shipped: {children('projects').map((n) => (
            <FileLink key={n} path={`projects/${n}`} label={n.replace('.md', '')} />
          ))}</span>
        );
      case 'contact':
      case 'email':
        return print(
          <span>email   <a className="t-file" href={`mailto:${EMAIL}`}>{EMAIL}</a></span>,
          <span>github  <a className="t-file" href={GITHUB} target="_blank" rel="noreferrer">{GITHUB}</a></span>
        );
      case 'github':
        window.open(GITHUB, '_blank', 'noopener');
        return print(<span className="t-dim">opening {GITHUB}</span>);
      case 'play':
      case 'game':
      case 'emrun': {
        const name = (arg || '').toLowerCase().replace(/^.*\//, '').replace(/\.\w+$/, '');
        const target = name && APPS.find((p) => p.toLowerCase().split('/').pop().startsWith(name));
        if (!target) {
          return print(
            name ? `${cmd}: ${arg}: no such game` : 'usage: play <name>',
            <span>{APPS.map((p) => <span key={p}><Cmd c={`play ${p.split('/').pop().replace(/\.\w+$/, '')}`} />{' '}</span>)}</span>
          );
        }
        open(target);
        return print(<span className="t-dim">running {target} ...</span>);
      }
      case 'coffee':
      case 'brew':
        return print(
          <pre className="t-art">{NEOFETCH_ART}</pre>,
          'brewing a cup of Chikmaglur arabica... done.'
        );
      case 'sudo':
        if (args[0] === 'hire-me' || args[0] === 'hire') {
          print(
            <span className="t-dim">[sudo] password for visitor: ********</span>,
            <span className="t-ok">access granted. opening your mail client...</span>
          );
          setTimeout(() => {
            window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Hello from nesarahippla.com')}`;
          }, 700);
          return;
        }
        return print('visitor is not in the sudoers file. This incident will be reported. (try "sudo hire-me")');
      case 'rm':
        return print("rm: permission denied. It's a portfolio, not a playground. (okay, it's a bit of a playground)");
      case 'echo':
        return print(args.join(' '));
      case 'date':
        return print(new Date().toString());
      case 'history':
        return print(...historyRef.current.slice().reverse().map((h, i) => `${String(i + 1).padStart(4)}  ${h}`));
      case 'man':
        return print('man pages are for real computers. try "help"');
      case 'exit':
      case 'logout':
        return print(<span>there is no exit. there are <Cmd c="play" /> games though.</span>);
      case 'clear':
        return setLines([]);
      default:
        return print(<span>zsh: command not found: {cmd}. try <Cmd c="help" /></span>);
    }
  }

  function run(raw) {
    const dir = cwdRef.current;
    print(<span>{prompt(dir)} {raw}</span>);
    if (raw.trim()) setHistory((h) => [raw, ...h]);
    setHIdx(-1);
    setInput('');
    exec(raw, dir);
  }

  function complete() {
    const parts = input.split(' ');
    if (parts.length === 1) {
      const hits = Object.keys(COMMANDS).map((c) => c.split(' ')[0]).filter((c) => c.startsWith(parts[0]));
      if (hits.length === 1) setInput(`${hits[0]} `);
      else if (hits.length > 1) print(<span>{prompt(cwd)} {input}</span>, hits.join('  '));
      return;
    }
    const last = parts[parts.length - 1];
    const slash = last.lastIndexOf('/');
    const base = slash >= 0 ? last.slice(0, slash) : '';
    const stem = last.slice(slash + 1);
    const dir = resolve(cwd, base);
    if (!isDir(dir)) return;
    const hits = children(dir).filter((n) => n.startsWith(stem));
    if (hits.length === 1) {
      parts[parts.length - 1] = (base ? `${base}/` : '') + hits[0];
      setInput(parts.join(' '));
    } else if (hits.length > 1) {
      print(<span>{prompt(cwd)} {input}</span>, hits.join('  '));
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      run(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(history.length - 1, hIdx + 1);
      if (i >= 0) { setHIdx(i); setInput(history[i]); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(Math.max(-1, i));
      setInput(i >= 0 ? history[i] : '');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div
      className="t-body"
      ref={bodyRef}
      onClick={() => { if (!window.getSelection().toString()) inputRef.current?.focus({ preventScroll: true }); }}
    >
      {lines.map((l) => <div key={l.id} className="t-line">{l.n}</div>)}
      <div className="t-line t-input-line">
        {prompt(cwd)}&nbsp;
        <input
          ref={inputRef}
          className="t-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
        />
      </div>
    </div>
  );
}
