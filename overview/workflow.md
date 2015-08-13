#Unique Workflow

Platform.sh proposes a truly unique workflow. The main idea is that for every
new feature developed a staging environment just for that feature is created
automatically.

You can test every feature in isolation and put it into production with a 
single click, or a single command on the command-line.

## Use any methodology
You can have just a traditional Development -> Staging -> production workflow.

But... you can also create as many branches for your code as you would like.
And Platform.sh will give you a hierarchical view of these branches. So for 
example, if you are using an agile methodology such as Scrum you can create branches for every sprint.
From each sprint you can  have branches for every user story. All the stories
become testable. You can continually merge to the sprint branch.. and validate
that on a continuous basis. So when the sprint ends, there is no testing
bottle-neck, and you can just merge to master and put the whole sprint into
production.

## Git Driven
Everything in Platform.sh is Git driven. Not only the code, but also the
infrastructure. 

You can have complex routing and caching, you have multiple applications
in the same project... and because we clone everything it is no more complicated
to manage than a basic Drupal installation.

So you have a perfect audit-log of who did what. And you
know that everything is automated which protects you from infrastructure rot.
