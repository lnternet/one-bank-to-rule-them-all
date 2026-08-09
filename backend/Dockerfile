FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/ ./backend/

WORKDIR /src/backend
RUN dotnet restore OneBankToRuleThemAllAPI.sln
RUN dotnet publish src/OneBankToRuleThemAllAPI.csproj --configuration Release --no-restore --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "OneBankToRuleThemAllAPI.dll"]
