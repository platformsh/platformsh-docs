# How we think

Platform.sh is built on two key philosophies:

* Your server infrastructure is part of your application, so it should be version controlled along with your application.
* **A**lways **B**e **C**ompiling

Interpreted languages like PHP or Node.js may not seem like they have to be compiled, but with modern package management tools like Composer or npm and with the growing use of CSS preprocessors such as Sass, most modern web applications need a “build” step between their source code and their production execution code.  At Platform.sh, we aim to make that easy.  That build step includes the entire application container, from language version to build tools to your code, rebuilt every time.

That’s true not just for production, though. Every branch you push can be a fully running environment, complete with your application code, a copy of your database, a copy of your search index, a copy of your user files, everything.  It really is “what would my site look like if I merged this to production?”  Every time.

You can use those concepts to replicate a traditional dev/stage/prod workflow, or to give every branch its own effective stage environment before merging to production.  Or have an intermediary integration branch for several other branches.  It’s entirely up to you.
