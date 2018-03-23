# easy-deploy
Tool for deploying frontend projects


## Create config
config.json
```
{
  "project": "id-of-the-project",
  "public": "public",
  "server": "server-name or api"
}
```

## Commands

Initialize a project: ask you for project name and project directory, also check for user credentials 
```
tool-name init
```


Login: ask for credentials
```
tool-name login
```


Generate token: generate token, usefull for CI/CD deployment 
```
tool-name create-token
```

Deploy the code to the server, defalut command is "deploy" 
```
tool-name
tool-name deploy
```

Deploy using token
```
tool-name --token=TOKEN_HERE
```

Deploy using ssh key
```
tool-name --ssh=PATH_TO_KEY
```
