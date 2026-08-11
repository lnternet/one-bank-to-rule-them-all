using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using OneBankToRuleThemAllAPI.Data;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = (builder.Configuration["ALLOWED_ORIGINS"] ?? string.Empty)
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .Concat([
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ])
    .Distinct()
    .ToArray();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddSingleton<IBankingRepository, InMemoryBankingRepository>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .WithMethods("GET", "OPTIONS")
            .AllowAnyHeader();
    });
});
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("per-ip", context =>
    {
        var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            });
    });
});

var app = builder.Build();

app.UseForwardedHeaders();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("frontend");
app.UseRateLimiter();

app.MapControllers().RequireRateLimiting("per-ip");

app.Run();

public partial class Program;
