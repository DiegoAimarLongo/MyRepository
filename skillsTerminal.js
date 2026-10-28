const terminal = document.querySelector('.skills-terminal');

if (terminal) {
  const output = terminal.querySelector('#skills-output');
  const outputTitle = terminal.querySelector('#skills-output-title');
  const outputContent = terminal.querySelector('#skills-output-content');
  const commandInput = terminal.querySelector('#skills-command');
  const commandForm = terminal.querySelector('#skills-command-form');
  const translate = (key) => terminal.querySelector(`[data-terminal-text="${key}"]`)?.textContent ?? key;

  const showOutput = (title, content) => {
    outputTitle.textContent = title;
    outputContent.textContent = content;
    output.hidden = false;
  };

  const executeCommand = (rawCommand) => {
    const command = rawCommand.trim();
    if (!command) return;

    if (command.toLowerCase() === 'clear') {
      output.hidden = true;
      return;
    }

    const commandKeys = {
      help: 'skills.commandHelp',
      'cat languages.txt': 'skills.commandLanguages',
      'cat engines.txt': 'skills.commandEngines',
      'cat tools.txt': 'skills.commandTools'
    };

    const resultKey = commandKeys[command.toLowerCase()] ?? 'skills.commandNotFound';
    const result = resultKey === 'skills.commandNotFound'
      ? `${translate(resultKey)}: ${command}`
      : translate(resultKey);
    showOutput(`${translate('skills.executePrefix')} $ ${command}`, result);
  };

  terminal.querySelectorAll('[data-command]').forEach((button) => {
    button.addEventListener('click', () => executeCommand(button.dataset.command));
  });

  commandForm.addEventListener('submit', (event) => {
    event.preventDefault();
    executeCommand(commandInput.value);
    commandInput.value = '';
  });
}
