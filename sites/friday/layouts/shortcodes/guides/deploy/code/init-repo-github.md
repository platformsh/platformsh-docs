1. Visit [`github.com/new`](https://github.com/new) to create a new repository. 
Sign up for a GitHub account if you don't already have one.

1. Provide a **Repository name** of `{{ .Get 0 }}`

1. Make sure that the repository is **Public**. 
Do not **Initialize** the repository with any files GitHub prompts you to add.

1. Click **Create repository**.

1. Add the GitHub repository as a remote of your local copy:

    ```bash
    git remote add origin git@github.com:<YOUR_USERNAME>/{{ .Get 0 }}.git
    ```

1. Push your code to GitHub:

    ```bash
    git push -u origin main
    ```
