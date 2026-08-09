using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using OneBankToRuleThemAllAPI.Models;
using Xunit;

namespace OneBankToRuleThemAllAPI.Tests;

public sealed class TransactionsEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public TransactionsEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetTransactions_ReturnsFakeTransactions()
    {
        var client = CreateClientForIp("203.0.113.10");

        var transactions = await client.GetFromJsonAsync<List<AccountTransaction>>(
            "/api/accounts/acct-123/transactions");

        Assert.NotNull(transactions);
        Assert.Equal(3, transactions.Count);
        Assert.All(transactions, transaction => Assert.Equal("acct-123", transaction.AccountId));
    }

    [Fact]
    public async Task Swagger_IsExposed()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/swagger/v1/swagger.json");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetTransactions_ReturnsCorsHeaderForAllowedOrigin()
    {
        var client = CreateClientForIp("203.0.113.12");
        client.DefaultRequestHeaders.Add("Origin", "http://localhost:5173");

        var response = await client.GetAsync("/api/accounts/acct-cors/transactions");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(response.Headers.TryGetValues("Access-Control-Allow-Origin", out var origins));
        Assert.Contains("http://localhost:5173", origins);
    }

    [Fact]
    public async Task GetTransactions_ReturnsTooManyRequestsAfterTenRequestsPerMinute()
    {
        var client = CreateClientForIp("203.0.113.11");

        for (var requestNumber = 0; requestNumber < 10; requestNumber++)
        {
            var response = await client.GetAsync("/api/accounts/acct-limited/transactions");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        var limitedResponse = await client.GetAsync("/api/accounts/acct-limited/transactions");

        Assert.Equal(HttpStatusCode.TooManyRequests, limitedResponse.StatusCode);
    }

    private HttpClient CreateClientForIp(string ipAddress)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Forwarded-For", ipAddress);
        return client;
    }
}
