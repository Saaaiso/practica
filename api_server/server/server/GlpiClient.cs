using server;
using System.Net.Http.Json;
using System.Text.Json.Serialization;


public class GlpiClient
{
    private readonly HttpClient _http; 
    private readonly string _baseurl;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _userName;
    private readonly string _password;


    private string? _accessToken;
    private string? _refreshToken;
    private DateTime _expireAt;

    public GlpiClient(string baseUrl,string clientId, string clientSecret, string userName, string password)
    {
        _baseurl = baseUrl.TrimEnd('/');
        _clientId = clientId;
        _clientSecret = clientSecret;
        _userName = userName;
        _password = password;
        _http = new HttpClient();
    }

    private async Task AuthenticateAsync()
    {
        var form = new Dictionary<string, string>
        {
            ["grant_type"] = "password",
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["username"] = _userName,
            ["password"] = _password,
            ["scope"] = "api"
        };

        var response = await _http.PostAsync(
            $"{_baseurl}/api.php/token",
             new FormUrlEncodedContent(form)
            );

        if (!response.IsSuccessStatusCode) {
            var error = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"GLPI error {response.StatusCode}: {error}");
        }
        response.EnsureSuccessStatusCode();

        var token = await response.Content.ReadFromJsonAsync<TokenResponse>();
        _accessToken = token!.AccessToken;
        _refreshToken = token!.RefreshToken;
        _expireAt = DateTime.UtcNow.AddSeconds(token.ExpiresIn -30);
    }


    private async Task RefreshTekenAsync()
    {
        var form = new Dictionary<string, string>
        {
            ["grant_type"] = "refresh_token",
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["refresh_token"] = _refreshToken,
        };

        var response = await _http.PostAsync(
            $"{_baseurl}/api.php/token",
            new FormUrlEncodedContent(form));

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"GLPI error {response.StatusCode}: {error}");
        }

        response.EnsureSuccessStatusCode();

        var token = await response.Content.ReadFromJsonAsync<TokenResponse>();
        _accessToken = token!.AccessToken;
        _refreshToken = token!.RefreshToken;
        _expireAt = DateTime.UtcNow.AddSeconds(token.ExpiresIn - 30);
    }

    private async Task EnsureTokenAsync()
    {
        if(_accessToken == null)
            await AuthenticateAsync();
        else if (DateTime.UtcNow >= _expireAt)
            await RefreshTekenAsync();
    }

    public async Task<List<GlpiDate>> GetTicketsAsync()
    {
        await EnsureTokenAsync();

        var request = new HttpRequestMessage(HttpMethod.Get, $"{_baseurl}/api.php/Assistance/Ticket");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _accessToken);
        request.Headers.TryAddWithoutValidation("Range", "0-999");

        var response = await _http.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"GLPI error {response.StatusCode}: {error}");
        }

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<GlpiDate>>();
    }
}

public class TokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }

    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}