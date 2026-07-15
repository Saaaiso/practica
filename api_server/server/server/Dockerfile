# Этап 1: сборка приложения
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Копируем только csproj сначала — для кэширования restore
COPY *.csproj ./
RUN dotnet restore

# Копируем весь остальной код и собираем
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Этап 2: финальный образ (без SDK, только runtime — меньше размер)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "server.dll"]