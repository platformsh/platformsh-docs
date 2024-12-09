---
title: "Sanitizing databases: PostgreSQL and Symfony"
sidebarTitle: PostgreSQL and Symfony
description: Sanitize PostgreSQL data in preview environments for Symfony apps.
layout: list
---

{{% sanitize-dbs/intro database="PostgreSQL" framework="Symfony" %}}

{{% sanitize-dbs/requirements database="PostgreSQL" framework="Symfony" %}}

{{% sanitize-dbs/sanitize-intro database="PostgreSQL" framework="Symfony" %}}

{{< codetabs >}}
+++
title=Manually
+++
{{% sanitize-dbs/sanitize-manually database="PostgreSQL" framework="Symfony" %}}

<--->
+++
title=Using a Symfony Command
+++

Assumptions:

- An Entity User exist and contains all of your PII (Personally Identifiable Information)
- [fakerphp/faker](https://fakerphp.github.io/) has been installed as a dependency on your Symfony application

Set up a script by following these steps:
1.  Create a Symfony command to sanitize data

    ```php {location="src/Command/SanitizeDataCommand.php"}
    <?php
    namespace App\Command;

    use App\Entity\User;
    use App\Repository\UserRepository;
    use Doctrine\ORM\EntityManagerInterface;
    use Faker;
    use Symfony\Component\Console\Command\Command;
    use Symfony\Component\Console\Input\InputInterface;
    use Symfony\Component\Console\Output\OutputInterface;
    use Symfony\Component\Console\Style\SymfonyStyle;

    class SanitizeDataCommand extends Command
    {
        protected static $defaultName = 'app:sanitize-data';

        protected static $defaultDescription = 'Sanitize user data (username and email).';

        public function __construct(
          private UserRepository $userRepository,
          private EntityManagerInterface $entityManager
        )
        {
            parent::__construct();
        }

        protected function configure()
        {
            $this->setDescription('This command allows you to sanitize user data (username and email).');
        }

        protected function execute(InputInterface $input, OutputInterface $output)
        {
            $io = new SymfonyStyle($input, $output);

            $users = $this->userRepository->findAll();
            $io->progressStart(count($users));

            /** @var User $user */
            foreach ($users as $user) {
                $io->progressAdvance();

                // initialize faker
                $faker = Faker\Factory::create();

                // sanitize user info
                $user->setUsername(uniqid($faker->userName()));
                $user->setEmail($faker->email());
                // adapt to your needs

                $this->entityManager->flush();
            }
            $io->progressFinish();

            return static::SUCCESS;
        }
    }
    ```

2.  Update the deploy hook to run your Symfony Command on each deploy.

    ```yaml {configFile="app"}
    applications:
      myapp:
        hooks:
          build: ...
          deploy: |
            if [ "$PLATFORM_ENVIRONMENT_TYPE" != production ]; then
              # The sanitization of the database should happen here (since it's non-production)
              php bin/console app:sanitize-data
            fi
    ```

    To sanitize only on the initial deploy and not all future deploys, on sanitization create a file on a mount. Then add a check for the file as in the following example:

    ```yaml {configFile="app"}
    applications:
      myapp:
        hooks:
          build: ...
          deploy: |
            if [ "$PLATFORM_ENVIRONMENT_TYPE" != production ] && [ ! -f MOUNT_PATH/is_sanitized ]; then
              # The sanitization of the database should happen here (since it's non-production)
              php bin/console app:sanitize-data
              touch MOUNT_PATH/is_sanitized
            fi
    ```

3.  Commit your changes by running the following command:

    ```bash
    git add src/Command/SanitizeDataCommand.php {{< vendor/configfile "app" >}} && git commit -m "Add sanitization."
    ```

    Push the changes to `staging` and verify that environment's database was sanitized.
    Once merged to production, all data from future preview environments are sanitized on environment creation.

<--->
+++
title=Using a shell script
+++
This example show you how to sanitize data on multiple projects inside an organization, except for production environments.

Assumptions:

- Symfony Command from previous tab `Using a Symfony Command` has already been pushed to all of your environments.

Set up a script by following these steps:


1.  Create an executable sanitizing script by running the following command:

    ```bash
    touch sanitize_fleet.sh && chmod +x sanitize_fleet.sh
    ```

3.  Make the script sanitize environments with an [environment type](../../administration/users.md#environment-type-roles)
    other than `production`.

    The following example runs only in preview environments
    and sanitizes data using the Symfony Command from previous tab, already pushed to all of your environments.

    ```bash {location="sanitize_fleet.sh"}
    if [ -n "$ZSH_VERSION" ]; then emulate -L ksh; fi
    ######################################################
    # fleet sanitization demo script, using the Symfony CLI.
    #
    # Enables the following workflow on a project:
    # .
    # └── main
    #     ├── staging
    #     |   └── new-feature
    #     └── auto-updates
    #
    # Usage
    # 1. source this script: `. sanitize_fleet.sh` or `source sanitize_fleet.sh` depending of your local machine
    # 2. define ORGANIZATION var: ORGANIZATION=<organizationIdentifier>
    # 3. run `sanitize_organization_data $ORGANIZATION`
    ######################################################

    # Utility functions.

    # list_org_projects: Print list of projects operation will be applied to before starting.
    #   $1: Organization, as it appears in console.{{< vendor/urlraw "host" >}}.
    list_org_projects () {
       symfony project:list -o $1 --columns="ID, Title"
    }

    # get_org_projects: Retrieve an array of project IDs for a given organization.
    #   Note: Makes array variable PROJECTS available to subsequent scripts.
    #   $1: Organization, as it appears in console.{{< vendor/urlraw "host" >}}.
    get_org_projects () {
      PROJECTS_LIST=$(symfony project:list -o $1 --pipe)
      PROJECTS=($PROJECTS_LIST)
    }

    # get_project_envs: Retrieve an array of envs IDs for a project.
    #   Note: Makes array variable ENVS available to subsequent scripts.
    #   $1: ProjectId, as it appears in console.{{< vendor/urlraw "host" >}}.
    get_project_envs () {
      ENV_LIST=$(symfony environment:list -p $1 --pipe)
      ENVS=($ENV_LIST)
    }

    # list_project_envs: Print list of envs operation will be applied to before starting.
    #   $1: ProjectId, as it appears in console.{{< vendor/urlraw "host" >}}.
    list_project_envs () {
      symfony environment:list -p $1
    }

    # add_env_var: Add environment level environment variable.
    #   $1: Variable name.
    #   $2: Variable value.
    #   $3: Target project ID.
    #   $4: Target environment ID.
    add_env_var () {
      VAR_STATUS=$(symfony project:curl -p $3 /environments/$4/variables/env:$1 | jq '.status')
      if [ "$VAR_STATUS" != "null" ]; then
        symfony variable:create \
        --name $1 \
        --value "$2" \
        --prefix env: \
        --project $3 \
        --environment $4 \
        --level environment \
        --json false \
        --sensitive false \
        --visible-build true \
        --visible-runtime true \
        --enabled true \
        --inheritable true \
        -q
      else
        printf "\nVariable $1 already exists. Skipping."
      fi
    }

    # Main functions.
    sanitize_organization_data () {
      list_org_projects $1
      get_org_projects $1
      for PROJECT in "${PROJECTS[@]}"
      do
        printf "\n### Project $PROJECT."
        # get environments list
        list_project_envs $PROJECT
        get_project_envs $PROJECT
        for ENVIRONMENT in "${ENVS[@]}"
        do
          unset -f ENV_CHECK
          ENV_CHECK=$(symfony project:curl -p $PROJECT /environments/$ENVIRONMENT | jq -r '.status')
          unset -f ENV_TYPE
          ENV_TYPE=$(symfony project:curl -p $PROJECT /environments/$ENVIRONMENT | jq -r '.type')

          if [ "$ENV_CHECK" = active -a "$ENV_TYPE" != production ]; then
            unset -f DATA_SANITIZED
            DATA_SANITIZED=$(symfony variable:get -p $PROJECT -e $ENVIRONMENT env:DATA_SANITIZED --property=value)
            if [ "$DATA_SANITIZED" != true ]; then
              printf "\nEnvironment $ENVIRONMENT exists and isn't sanitized yet. Sanitizing data."
              printf "\n"
              # do sanitization here
              symfony ssh -p $PROJECT -e $ENVIRONMENT -- php bin/console app:sanitize-data
              printf "\nSanitizing data is finished, redeploying"
              add_env_var DATA_SANITIZED true $PROJECT $ENVIRONMENT
            else
              printf "\nEnvironment $ENVIRONMENT exists and doesn't need to be sanitized. skipping."
            fi
          elif [ "$ENV_TYPE" == production ]; then
            printf "\nEnvironment $ENVIRONMENT is production one, skipping."
          else
            printf "\nEnvironment $ENVIRONMENT isn't active $ENV_CHECK, skipping."
          fi
        done
      done
    }
    ```

4.  use this shell script

    Depending on the machine you want to run this script on, adapt this to your needs.

    ```bash
    . sanitize_fleet.sh  # or source sanitize_fleet.sh
    ORGANIZATION=<organizationIdentifier>
    sanitize_organization_data $ORGANIZATION
    ```

{{< note >}}
You can find the organization identifier for a specific project, within the {{% vendor/name %}} console, by clicking on your name, and then on “Settings”, in the top right corner.
{{< /note >}}


4.  [Option] Commit your changes by running the following command:

    ```bash
    git add sanitize_fleet.sh && git commit -m "Add sanitization."
    ```

    Push the changes to `staging` and verify that environment's database was sanitized.
    Once merged to production, all data from future preview environments are sanitized on environment creation.

{{< /codetabs >}}

## What's next

{{% sanitize-dbs/whats-next %}}

If your database contains a lot of data, consider using the [`REINDEX` statement](https://www.postgresql.org/docs/current/sql-reindex.html) to help improve performance.
