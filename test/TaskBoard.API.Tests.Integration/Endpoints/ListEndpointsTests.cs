using System.Net;
using System.Net.Http.Json;
using System.Text;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TaskBoard.API.Contracts.Requests.List;
using TaskBoard.API.Contracts.Responses.List;
using TaskBoard.DAL.Data;

namespace TaskBoard.API.Tests.Integration.Endpoints;

public class ListEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IAsyncLifetime
{

    private readonly string _listsEndpoint = "/lists";
    private readonly HttpClient _client;
    private readonly IServiceProvider _serviceProvider;
    private readonly TaskBoardDbContext _dbContext;
    private readonly DbInitializer _dbInitializer;

    public ListEndpointsTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _serviceProvider = factory.Services;
        var scope = factory.Services.CreateScope();
        _dbContext = scope.ServiceProvider.GetRequiredService<TaskBoardDbContext>();
        _dbInitializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
    }

    public async Task InitializeAsync()
    {
        await _dbContext.Database.EnsureDeletedAsync();
        await _dbInitializer.InitializeAsync();
    }

    public Task DisposeAsync()
    {
        return Task.CompletedTask;
    }

    [Fact]
    public async Task GetListById_ReturnsList_WhenListExists()
    {
        // Arrange
        var list = await _dbContext.Lists.FirstAsync();
        var url = $"{_listsEndpoint}/{list.Id}";
        var expectedResponse = new ListResponse
        {
            Id = list.Id,
            Name = list.Name,
        };

        // Act
        var response = await _client.GetAsync(url);
        var listResponse = await response.Content.ReadFromJsonAsync<ListResponse>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        listResponse.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GetListById_ReturnsNotFound_WhenListDoesNotExist()
    {
        // Arrange
        var url = $"{_listsEndpoint}/1000000";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetListById_ReturnsInternalServerError_WhenListIdIsInvalid()
    {
        // Arrange
        var url = $"{_listsEndpoint}/foo";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task CreateList_ReturnsList_WhenListIsCreated()
    {
        // Arrange
        var board = await _dbContext.Boards.FirstAsync();
        var createRequest = new CreateListRequest
        {
            Name = "Name",
            BoardId = board.Id,
        };
        var expectedResponse = new ListResponse
        {
            Name = createRequest.Name,
        };

        // Act
        var response = await _client.PostAsJsonAsync(_listsEndpoint, createRequest);
        var listResponse = await response.Content.ReadFromJsonAsync<ListResponse>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        listResponse.Should().BeEquivalentTo(expectedResponse, o => o.Excluding(l => l.Id));
        var list = await _dbContext.Lists.FirstAsync(l => l.Id == listResponse!.Id);
        list.Should().BeEquivalentTo(listResponse);
    }

    [Fact]
    public async Task CreateList_ReturnsBadRequest_WhenListIsInvalid()
    {
        // Arrange
        var board = await _dbContext.Boards.FirstAsync();
        var createRequest = new CreateListRequest
        {
            Name = "h",
            BoardId = board.Id,
        };

        // Act
        var response = await _client.PostAsJsonAsync(_listsEndpoint, createRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateList_ReturnsInternalServerError_WhenBoardDoesNotExist()
    {
        // Arrange
        var createRequest = new CreateListRequest
        {
            Name = "Name",
            BoardId = 1_000_000,
        };

        // Act
        var response = await _client.PostAsJsonAsync(_listsEndpoint, createRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task CreateList_ReturnsInternalServerError_WhenRequestIsMalformed()
    {
        // Arrange
        var malformedRequest = new StringContent("Foo", Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync(_listsEndpoint, malformedRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task UpdateList_ReturnsNoContent_WhenListIsUpdated()
    {
        // Arrange
        var list = await _dbContext.Lists.FirstAsync();
        var url = $"{_listsEndpoint}/{list.Id}";
        var updateRequest = new UpdateListRequest
        {
            Name = "New Name",
        };

        // Act
        var response = await _client.PutAsJsonAsync(url, updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        using var scope = _serviceProvider.CreateScope();
        var newDbContext = scope.ServiceProvider.GetRequiredService<TaskBoardDbContext>();
        list = await newDbContext.Lists.FirstAsync(l => l.Id == list.Id);
        list.Should().BeEquivalentTo(updateRequest);
    }

    [Fact]
    public async Task UpdateList_ReturnsNotFound_WhenListDoesNotExist()
    {
        // Arrange
        var url = $"{_listsEndpoint}/1000000";
        var updateRequest = new UpdateListRequest
        {
            Name = "New Name",
        };

        // Act
        var response = await _client.PutAsJsonAsync(url, updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateList_ReturnsBadRequest_WhenListIsInvalid()
    {
        // Arrange
        var list = await _dbContext.Lists.FirstAsync();
        var url = $"{_listsEndpoint}/{list.Id}";
        var updateRequest = new UpdateListRequest
        {
            Name = "h",
        };

        // Act
        var response = await _client.PutAsJsonAsync(url, updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateList_ReturnsInternalServerError_WhenRequestIsMalformed()
    {
        // Arrange
        var list = await _dbContext.Lists.FirstAsync();
        var url = $"{_listsEndpoint}/{list.Id}";
        var malformedRequest = new StringContent("Foo", Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PutAsync(url, malformedRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task DeleteListById_ReturnsNoContent_WhenListIsDeleted()
    {
        // Arrange
        var list = await _dbContext.Lists.FirstAsync();
        var url = $"{_listsEndpoint}/{list.Id}";

        // Act
        var response = await _client.DeleteAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        list = await _dbContext.Lists.FirstOrDefaultAsync(c => c.Id == list.Id);
        list.Should().BeNull();
    }

    [Fact]
    public async Task DeleteListById_ReturnsNotFound_WhenListDoesNotExist()
    {
        // Arrange
        var url = $"{_listsEndpoint}/1000000";

        // Act
        var response = await _client.DeleteAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteListById_ReturnsInternalServerError_WhenListIdIsntValid()
    {
        // Arrange
        var url = $"{_listsEndpoint}/foo";

        // Act
        var response = await _client.DeleteAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }
}