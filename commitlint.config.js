module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(?::\w*:|🌈|🎨|🐳|🐎|⚡️|🔥|🐛|🚑️|✨|📝|⚗️|🚀|💄|🎉|✅|🔒️|🔖|🚨|🚧|💚|⬇️|⬆️|📌|👷|📈|♻️|➕|📃|🦄|🐞|🎈|➖|🔨|🌐|✏️|💩|⏪️|🔀|📦️|👽️|🚚|📄|💥|🍱|♿️|💡|🔊|🔇|👥|🚸|🏗️|📱|🤡|🥚|🎨|🌱|🔍️|🏷️|🌟|🚩|🥅|💫|🗑️|🛂|🩹|🧐|⚰️|🧪|👔|🩺|🧱|🧑‍💻|🎸|🔮|🔧)?\s*(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s*(?<subject>(?:(?!#).)*(?:(?!:).)*)$/
    }
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'init',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'chore',
        'revert',
        'ci',
        'release',
        'workflow',
        'types',
        'wip',
        'merge'
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']]
  }
}
