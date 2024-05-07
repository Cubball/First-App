FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src/

COPY ./src/TaskBoard.DAL/TaskBoard.DAL.csproj ./TaskBoard.DAL/TaskBoard.DAL.csproj
COPY ./src/TaskBoard.BLL/TaskBoard.BLL.csproj ./TaskBoard.BLL/TaskBoard.BLL.csproj
COPY ./src/TaskBoard.API/TaskBoard.API.csproj ./TaskBoard.API/TaskBoard.API.csproj
RUN dotnet restore ./TaskBoard.API/

COPY ./src/TaskBoard.DAL/ ./TaskBoard.DAL/
COPY ./src/TaskBoard.BLL/ ./TaskBoard.BLL/
COPY ./src/TaskBoard.API/ ./TaskBoard.API/
RUN dotnet publish -c Release -o ./app/ ./TaskBoard.API/ --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app/
COPY --from=build /src/app/ .
ENV ASPNETCORE_HTTP_PORTS=5001
ENTRYPOINT [ "dotnet", "TaskBoard.API.dll" ]
