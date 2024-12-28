# Match My Music

Welcome to the **Match My Music** Repository!

## Getting started

After cloning this repo run: `curl -fsSL https://unyt.land/install.sh | bash` or `irm https://unyt.land/install.ps1 | iex` (if you are using windows).
Now you have UIX and all other dependencies installed.

To start the App run `uix`.

## Contributing
We are using a variation of the **feature branch workflow** utilizing **rebase**.

### Branch Naming Convention

In order to maintain readability in the commit graph, please use those prefixes for the different types of branches:
- feature: feat_*<name\>*<issue  number\>
- bug fix: fix_*<name\>*<issue  number\>
- refactor: ref_*<name\>*<issue  number\>
- documentation: doc_*<name\>*<issue  number\>

The name should be a short and logical description

### Commit Messages

Simmilar to the branches, we want to maintain readability in the commit messages. The mention of the issue using **#** also links the commit message to the issue. This makes quick work of finding where and when things were changed. Please use this format:
- feature: feat: <commit message\> #<issue  number\>
- bug fix: fix: <commit message\> #<issue  number\>
- refactor: ref: <commit message\> #<issue  number\>
- documentation: doc: <commit message\> #<issue  number\>


### Workflow
If you don't know how **rebase** works, read [this](https://git-scm.com/docs/git-rebase) (though the documentation is a bit complex)

1. create a new branch from **development** using the naming convention above and referencing an issue (make sure your development branch is up to date)
2. switch to that branch
3. develop your feature
4. peer review your feature
5.  rebase your branch from **development**
6. switch to development and merge your feature branch
7. delete the feature branch on remote (It's sometimes useful to keep old feature branches locally)

If you always do it that way, we should in theory never face a merge conflict (But its gonna happen :D)

**Let's go through an example:**
Assuming we have an Issue #3 that describes the feature we want to implement.

    git switch development # make sure you are on development
    git pull	# make sure you are branching from the newest version of development
    git branch feat_button_thingi_3
    git switch feat_button_thingi_3
    
    # now develop your ass off
    git commit -m "feat: added that button thingi #3"
    # you presented your feature and it has been approved by everyone
    
    git switch development
    git pull	# make sure you are rebasing on the newest version of development
    git switch feat_button_thingi_3
    git rebase development
    git switch development
    git merge feat_button_thingi_3
    git push

### Important Notes
- Create a branch for **one** atomic feature (this minimizes the chance of multiple people working on the same branch and breaking everything)
- A branch usually belongs to an **Issue** in which the feature is described (does not have to be excessive, short notes are enough)
- Take the time to write **meaningful** commit messages

- The development branch is for **finished and tested features!** Don't push half finished or buggy features and try to minimize console.log()'s

And most importantly:
- **if you break the development branch, you are buying a round of drinks for everyone!**

## Best Practices

### Variable Naming Convention
In order to maintain continuity in this codebase, please use this naming conventions:
- for **Functions and Methods**: use **camelCase** (for example `function doThisThing(){}`)
- for **variables and constants**: use **snake_case** (for example `const thats_a_thing = 1;`)

**Please document your functions** if they are not trivial!
for example: 

    /**
    *doSomething: Does Something.
    *
    * @param  id - The ID of something.
    * */
    doSomething(obj:  Something) {
	    // Do non-trivial shit
	  }
If you do it that way, this comment appears nicely formatted in VSCode if you hover over that function anywhere, so its actually useful!

