TODO

# easy-deploy

Tool for deploying frontend projects

## Create config

config.json

```
{
  "project": "id-of-the-project",
  "public": "public",
  "server": "server-name or api",
  "path": "path to the http folder"
}
```

## Commands

Initialize a project: ask you for project name and project directory, also check for user credentials

```
tool-name init
```

Deploy the code to the server, default command is "deploy"

```
tool-name deploy
```

Deploy using ssh key

```
tool-name deploy --ssh="supply an SSH for this command"
tool-name deploy --config="path to config"
tool-name deploy --server="server name"
tool-name deploy --path="path on the server"
```
