using Core.Application.Interfaces;
using Core.Application.Services;
using Core.Infrastructure.Db;
using Core.Infrastructure.Messaging;

var builder = WebApplication.CreateBuilder(args);

// Core ASP.NET services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Logging.AddConsole();

// CORS
var allowedOrigin = builder.Configuration["CORS:AllowedOrigin"] ?? "http://localhost:5173";
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p.WithOrigins(allowedOrigin)
                             .AllowAnyHeader()
                             .AllowAnyMethod());
});

// Infrastructure layer
builder.Services.AddSingleton<IDbConnectionFactory, NpgsqlConnectionFactory>();
builder.Services.AddSingleton<IRabbitPublisher, RabbitPublisher>();

// Application layer
builder.Services.AddScoped<ICandidatesService, CandidatesService>();
builder.Services.AddScoped<IJobsService, JobsService>();
builder.Services.AddScoped<IMetricsService, MetricsService>();
builder.Services.AddScoped<IRankingsService, RankingsService>();
builder.Services.AddScoped<ISeedService, SeedService>();

var app = builder.Build();

// Middleware
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

app.Run();
