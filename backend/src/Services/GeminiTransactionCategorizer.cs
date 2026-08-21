using System.Net.Http.Json;
using System.Text.Json.Serialization;
using OneBankToRuleThemAllAPI.Models;

namespace OneBankToRuleThemAllAPI.Services;

public sealed class GeminiTransactionCategorizer : ITransactionCategorizer
{
    private const string GeminiModel = "gemini-2.5-flash";

    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GeminiTransactionCategorizer(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<SpendingCategory> CategorizeAsync(
        AccountTransaction transaction,
        CancellationToken cancellationToken)
    {
        var apiKey = GetApiKey()?.Trim();
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "Missing Gemini API key. Set GOOGLE_AI_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY.");
        }

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"v1beta/models/{GeminiModel}:generateContent");

        request.Headers.Add("x-goog-api-key", apiKey);
        request.Content = JsonContent.Create(new GenerateContentRequest(
        [
            new GeminiContent(
            [
                new GeminiPart(BuildPrompt(transaction)),
            ]),
        ]));

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<GenerateContentResponse>(
            cancellationToken: cancellationToken);
        var selectedCategory = body?.Candidates?
            .FirstOrDefault()?
            .Content?
            .Parts?
            .FirstOrDefault()?
            .Text?
            .Trim();

        if (Enum.TryParse<SpendingCategory>(selectedCategory, ignoreCase: true, out var category))
        {
            return category;
        }

        throw new InvalidOperationException("Gemini did not return a valid spending category.");
    }

    private string? GetApiKey()
    {
        return _configuration["GOOGLE_AI_API_KEY"]
            ?? _configuration["GEMINI_API_KEY"]
            ?? _configuration["OPENAI_API_KEY"];
    }

    private static string BuildPrompt(AccountTransaction transaction)
    {
        var categories = string.Join(", ", Enum.GetNames<SpendingCategory>());

        return $"""
            Pick the best spending category for this banking transaction.
            Allowed categories: {categories}

            Return exactly one category name from the allowed list. No punctuation, no explanation.

            Transaction:
            Message: {transaction.Message}
            Type: {transaction.Type}
            Amount: {transaction.Amount} {transaction.Currency}
            From: {transaction.FromAccountName}
            To: {transaction.ToAccountName}
            Date: {transaction.TransactionDate:yyyy-MM-dd}
            """;
    }

    private sealed record GenerateContentRequest(
        [property: JsonPropertyName("contents")] IReadOnlyList<GeminiContent> Contents);

    private sealed record GeminiContent(
        [property: JsonPropertyName("parts")] IReadOnlyList<GeminiPart> Parts);

    private sealed record GeminiPart(
        [property: JsonPropertyName("text")] string Text);

    private sealed record GenerateContentResponse(
        [property: JsonPropertyName("candidates")] IReadOnlyList<GeminiCandidate>? Candidates);

    private sealed record GeminiCandidate(
        [property: JsonPropertyName("content")] GeminiResponseContent? Content);

    private sealed record GeminiResponseContent(
        [property: JsonPropertyName("parts")] IReadOnlyList<GeminiPart>? Parts);
}
