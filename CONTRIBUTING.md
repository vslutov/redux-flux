# Contribution is fun! :green_heart:

I'm really glad you're reading this, because we need volunteer developers to help this project come to fruition.

Happy Contributing :slightly_smiling_face:

## :arrow_down: Installation

- First, fork this repository :fork_and_knife: and follow the given instructions:

```bash
# clone the repository to your local machine
$ git clone https://github.com/<YOUR-GITHUB-USERNAME>/redux-flux.git

# navigate to the project's directory and install all the relevant dev-dependencies
$ cd redux-flux && NODE_ENV=development npm ci

# include all the latest changes from the remote repository
$ git remote add upstream https://github.com/vslutov/redux-flux.git
$ git pull --rebase upstream develop
```

Next, create a new branch for the particular issue - `$ git checkout -b <NEW-BRANCH-NAME>` and make PR from that branch while leaving **master** branch unchanged :white_check_mark:

## :construction: Development

- In your branch you can run the following command:
```bash
# testing locally
$ npm test

# automatic fix codestyle
$ npx standard --fix

# building locally
$ npm run build
```

- Once you have made your changes, run the following command:

```bash
# add your changes
$ git add .

# make your commit
$ git commit -m "<YOUR-COMMIT-MESSAGE>"
```

> Think you're ready :grey_question: Make the PR :tropical_drink:


## :page_with_curl: Guidelines

Being an open-source contributor is awesome :bowtie: but with great awesomeness comes great responsibility; and the responsibility of what you might ask! Well, you certainly don't wanna make a PR that would break the codebase :x:, or instead of fixing bugs, creates more :beetle:. So, here are some curated guidelines one should follow while contributing :trophy:

- Raise an issue regarding bug fixes or feature enhancements, before making a PR.

- While raising an issue, please follow the [ISSUE_TEMPLATE](.github/ISSUE_TEMPLATE) guidelines.

- First, claim an issue and make a PR only when you're assigned to it.

- To claim an issue, just leave a comment and you'll be assigned on `first come, first serve` basis.

- Organize your code adhered to [Standard style guide][1] as much as possible.

- Configure your editor to support the preferences from the [.editorconfig](.editorconfig) file.

- A feature enhancement PR should include corresponding unit tests.

- Squash your commits for cleaner commit history.

- While making a PR, please follow the [pull_request_template.md](.github/pull_request_template.md) guidelines and mention the issue you are solving, like so - `Fixed #2`.

- Your PR must pass the [Travis CI][2], [Codacy][3] checks for it to be considered getting merged.

- Maintain a healthy environment and don't indulge in any kind of activities that's against the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

<p align="center">Made with :hearts: for the Community!</p>

[1]: https://standardjs.com/
[2]: https://travis-ci.org/
[3]: https://www.codacy.com/
