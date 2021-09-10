# Aitheon - Orchestrator 

## Server Side Info
- routing library https://github.com/typestack/routing-controllers
- orm - mongosee

## Client Side info
- angular v7
- bootstrap v4.1
- ngx-bootstrap v3
- ngx-toastr

### 1. Setup cluster for developer
- `kubectl` setup required. [install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
- Get package with credentials (3 files and sh script) from admin
- Download all files into one folder and navigate to this folder at console
- Run command

```
mv ./setup-cluster.txt ./setup-cluster.sh && chmod +x ./setup-cluster.sh && ./setup-cluster.sh
```


### 2. NPM config to work with private packages

Create a new "readonly" token (or ask for a token from a team lead), following "Working with tokens from the web" at  https://docs.npmjs.com/getting-started/working_with_tokens. 
Replace `00000000-0000-0000-0000-000000000000` below with your token and run it.  
Your teamlead will have to add permissions for your token.  

##### 2.1 Use an editor `vim` or `nano` and edit a `~/.profile` file.
But it depends on your default terminal cliient. For example, zsh has ~/.zshrc file, so edit the appropriate one inside `~` folder.
```
nano ~/.profile
```

##### 2.2 append following file with a correct token value
```
export NPM_TOKEN="00000000-0000-0000-0000-000000000000"
```

##### 2.3 Important! Full logout from ubuntu terminal

##### 2.4 Verify all correct
If result of below command is a token then you are good
```
echo $NPM_TOKEN
```

### 3. Run a MongoDB proxy
- Mongo will run on a default port. 
- Mongodb connection string is at .env file. But it will be loaded when app starts
```
./proxy-db.sh
```

### 4. npm i
### 5. npm run core:init
### 6. Run server: `npm run debug && npm start`
6.1 To verify all is good, it generates server/docs/swagger.json
API documentation address
```
http://localhost:3000/api/docs/
```

### 7. Install Docker
7.1 Add docker permission (for Ubuntu)
    Run this command and then completely log out of your account and log back in (if in doubt, reboot!)
    ```
    'sudo usermod -a -G docker $USER'
    ```

### 8. Generate REST Client code. 
script will generate services code and put it to `projects/aitheon/{projectName}/src/lib/rest`. 
Run Rest lib generator. 
```
npm run core:generate-rest && npm run client:lib:watch
```

in case if above fails, run:
```
sudo rm -rf client/projects/aitheon/orchestrator/src/lib/rest
```

### 9. Wait for previous step to compile or you will get error. 
Then Run Client lib
```
npm run client:watch
```

###### Optional. 
Documentation for Rest library. All generated models and rest services you can check also at `projects/aitheon/{projectName}/src/lib/rest`
```
cd client && npm run docs
```
Documentation for Rest Library
http://localhost:3000/api/client-docs/

Webhook test

###### Cleanup node modules
```
rm -rf node_modules client/node_modules package-lock.json client/package-lock.json
npm cache clear --force
```

##### Forward Mail service to local port
- Mail will run on port 2525
```
./proxy-mail.sh
```
