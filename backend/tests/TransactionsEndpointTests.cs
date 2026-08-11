using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Testing;
using OneBankToRuleThemAllAPI.Models;
using Xunit;

namespace OneBankToRuleThemAllAPI.Tests;

public sealed class TransactionsEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() },
    };

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
            "/api/accounts/acct-bag-end/transactions",
            JsonOptions);

        Assert.NotNull(transactions);
        Assert.True(transactions.Count >= 5);
        Assert.All(transactions, transaction =>
            Assert.True(transaction.FromAccountId == "acct-bag-end" || transaction.ToAccountId == "acct-bag-end"));
    }

    [Fact]
    public async Task GetUsers_ReturnsUsers()
    {
        var client = CreateClientForIp("203.0.113.15");

        var users = await client.GetFromJsonAsync<List<User>>("/api/users", JsonOptions);

        Assert.NotNull(users);
        Assert.Equal(3, users.Count);
        Assert.Contains(users, user => user.Name == "Frodo Baggins");
    }

    [Fact]
    public async Task GetAccounts_ReturnsAccountsForUser()
    {
        var client = CreateClientForIp("203.0.113.13");

        var accounts = await client.GetFromJsonAsync<List<Account>>(
            "/api/users/user-frodo/accounts",
            JsonOptions);

        Assert.NotNull(accounts);
        Assert.Equal(2, accounts.Count);
        Assert.All(accounts, account => Assert.Equal("user-frodo", account.UserId));
    }

    [Fact]
    public async Task GetTransaction_ReturnsTransactionDetails()
    {
        var client = CreateClientForIp("203.0.113.14");

        var transaction = await client.GetFromJsonAsync<AccountTransaction>(
            "/api/transactions/txn-001",
            JsonOptions);

        Assert.NotNull(transaction);
        Assert.Equal("txn-001", transaction.Id);
        Assert.Equal("Bag End Checking", transaction.FromAccountName);
        Assert.Equal(TransactionType.Instant, transaction.Type);
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

        var response = await client.GetAsync("/api/accounts/acct-bag-end/transactions");

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
            var response = await client.GetAsync("/api/accounts/acct-bag-end/transactions");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        var limitedResponse = await client.GetAsync("/api/accounts/acct-bag-end/transactions");

        Assert.Equal(HttpStatusCode.TooManyRequests, limitedResponse.StatusCode);
    }

    private HttpClient CreateClientForIp(string ipAddress)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Forwarded-For", ipAddress);
        return client;
    }
}
