# Task Board
This is a web application to manage your tasks organized into dedicated lists. Tasks (cards) have a name, description, due date and priority. Lists have a name. You can create, modify and delete all your cards and lists. All of the changes to the cards are recorded and can be viewed in "History".

Upon first launch the application will have 2 lists prepopulated with 5 cards each.

## How To Run
### Using docker-compose
To run the app using docker compose:
1. Clone the repo
```
git clone https://github.com/Cubball/First-App
```
2. Go into the created folder
```
cd First-App
```
3. Switch the branch to 'dev'
```
git checkout dev
```
4. Run docker-compose
```
docker compose up
```
That's it, the app is preconfigured in the [compose file](compose.yaml), so no extra configuration is required. After all of the containers have started, you'll have 3 running containers:
- Angular application on port 5000 (http)
- ASP .NET Core API on port 5001 (http)
- PostgreSQL database on port 5002 (http)

### Running locally
To run locally, make sure you have installed:
- .NET 8 SDK
- Angular CLI
- PostgreSQL
1. Repeat steps 1-3 from [using docker-compose section](#using-docker-compose)
2. Replace the "DefaultConneciton" entry in [TaskBoard.API/appsettings.Development.json](TaskBoard.API/appsettings.Development.json#L9) with your own connection string to the PostreSQL database.
3. Run the API
```
dotnet run --project ./TaskBoard.API/
```
4. In a new terminal, go to the TaskBoard.Web folder
```
cd ./TaskBoard.Web/
```
5. Install all of the dependencies
```
npm i
```
6. Run the Angular app
```
ng serve
```
After that, you should have:
- Angular application running on port 4200 (http)
- ASP .NET Core API running on port 5047 (http)
