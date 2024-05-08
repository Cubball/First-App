using System.Net;
using System.Net.Http.Json;
using System.Text;
using FluentAssertions;
using FluentAssertions.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TaskBoard.API.Contracts.Requests.Card;
using TaskBoard.API.Contracts.Responses.Card;
using TaskBoard.DAL.Data;
using TaskBoard.DAL.Entities;

namespace TaskBoard.API.Tests.Integration.Endpoints;

public class CardEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IAsyncLifetime
{
    private readonly string _cardsEndpoint = "/cards";
    private readonly HttpClient _client;
    private readonly IServiceProvider _serviceProvider;
    private readonly TaskBoardDbContext _dbContext;
    private readonly DbInitializer _dbInitializer;

    public CardEndpointsTests(CustomWebApplicationFactory factory)
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
    public async Task GetCardById_ReturnsCard_WhenCardExists()
    {
        // Arrange
        var card = await _dbContext.Cards
            .Include(c => c.List)
            .FirstAsync();
        var url = $"{_cardsEndpoint}/{card.Id}";
        var expectedResponse = new CardFullResponse
        {
            Id = card.Id,
            Name = card.Name,
            Description = card.Description,
            DueDate = card.DueDate,
            Priority = card.Priority,
            ListId = card.ListId,
            ListName = card.List.Name,
        };

        // Act
        var response = await _client.GetAsync(url);
        var cardResponse = await response.Content.ReadFromJsonAsync<CardFullResponse>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        cardResponse.Should().BeEquivalentTo(expectedResponse, o => o
            .Using<DateTime>(ctx => ctx.Subject.Should().BeCloseTo(ctx.Expectation, 1.Milliseconds()))
            .WhenTypeIs<DateTime>());
    }

    [Fact]
    public async Task GetCardById_ReturnsNotFound_WhenCardDoesNotExist()
    {
        // Arrange
        var url = $"{_cardsEndpoint}/1000000";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetCardById_ReturnsInternalServerError_WhenCardIdIsntValid()
    {
        // Arrange
        var url = $"{_cardsEndpoint}/foo";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task CreateCard_ReturnsCard_WhenCardIsCreated()
    {
        // Arrange
        var list = await _dbContext.Lists.FirstAsync();
        var createRequest = new CreateCardRequest
        {
            Name = "Name",
            Description = "Description",
            Priority = "Low",
            DueDate = DateTime.UtcNow.AddDays(10),
            ListId = list.Id
        };
        var expectedResponse = new CardFullResponse
        {
            Name = createRequest.Name,
            Description = createRequest.Description,
            DueDate = createRequest.DueDate,
            Priority = createRequest.Priority,
            ListId = createRequest.ListId,
            ListName = list.Name,
        };

        // Act
        var response = await _client.PostAsJsonAsync(_cardsEndpoint, createRequest);
        var cardResponse = await response.Content.ReadFromJsonAsync<CardFullResponse>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        cardResponse.Should().BeEquivalentTo(expectedResponse, o => o
            .Excluding(c => c.Id)
            .Using<DateTime>(ctx => ctx.Subject.Should().BeCloseTo(ctx.Expectation, 1.Milliseconds()))
            .WhenTypeIs<DateTime>());
        var card = await _dbContext.Cards.FirstAsync(c => c.Id == cardResponse!.Id);
        card.Should().BeEquivalentTo(cardResponse, o => o
            .ExcludingMissingMembers()
            .Using<DateTime>(ctx => ctx.Subject.Should().BeCloseTo(ctx.Expectation, 1.Milliseconds()))
            .WhenTypeIs<DateTime>());
    }

    [Theory]
    [MemberData(nameof(CreateCardInvalidTestData))]
    public async Task CreateCard_ReturnsBadRequest_WhenCardIsInvalid(CreateCardRequest invalidRequest)
    {
        // Act
        var response = await _client.PostAsJsonAsync(_cardsEndpoint, invalidRequest);
        var cardResponse = await response.Content.ReadFromJsonAsync<CardFullResponse>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateCard_ReturnsInternalServerError_WhenRequestIsMalformed()
    {
        // Arrange
        var malformedRequest = new StringContent("Foo", Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync(_cardsEndpoint, malformedRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task UpdateCard_ReturnsNoContent_WhenCardIsUpdated()
    {
        // Arrange
        var card = await _dbContext.Cards.FirstAsync();
        var url = $"{_cardsEndpoint}/{card.Id}";
        var updateRequest = new UpdateCardRequest
        {
            Name = "New Name",
            Description = card.Description,
            Priority = card.Priority,
            DueDate = card.DueDate,
            ListId = card.ListId,
        };

        // Act
        var response = await _client.PutAsJsonAsync(url, updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        using var scope = _serviceProvider.CreateScope();
        var newDbContext = scope.ServiceProvider.GetRequiredService<TaskBoardDbContext>();
        card = await newDbContext.Cards.FirstAsync(c => c.Id == card.Id);
        card.Should().BeEquivalentTo(updateRequest, o => o
            .Using<DateTime>(ctx => ctx.Subject.Should().BeCloseTo(ctx.Expectation, 1.Milliseconds()))
            .WhenTypeIs<DateTime>());
    }

    [Fact]
    public async Task UpdateCard_ReturnsNotFound_WhenCardDoesNotExist()
    {
        // Arrange
        var url = $"{_cardsEndpoint}/1000000";
        var updateRequest = new UpdateCardRequest
        {
            Name = "New Name",
            Description = "Description",
            Priority = "Low",
            DueDate = DateTime.UtcNow.AddDays(10),
            ListId = 1,
        };

        // Act
        var response = await _client.PutAsJsonAsync(url, updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Theory]
    [MemberData(nameof(UpdateCardInvalidTestData))]
    public async Task UpdateCard_ReturnsBadRequest_WhenCardIsInvalid(UpdateCardRequest invalidRequest)
    {
        // Arrange
        var card = await _dbContext.Cards.FirstAsync();
        var url = $"{_cardsEndpoint}/{card.Id}";

        // Act
        var response = await _client.PutAsJsonAsync(url, invalidRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateCard_ReturnsBadRequest_WhenNewListIsInOtherBoard()
    {
        // Arrange
        var card = await _dbContext.Cards.FirstAsync();
        var newBoard = new Board
        {
            Name = "Name",
            Lists = [new() { Name = "Name" }],
        };
        _dbContext.Boards.Add(newBoard);
        await _dbContext.SaveChangesAsync();
        var url = $"{_cardsEndpoint}/{card.Id}";
        var invalidRequest = new UpdateCardRequest
        {
            Name = card.Name,
            Description = card.Description,
            Priority = card.Priority,
            DueDate = card.DueDate,
            ListId = newBoard.Lists.First().Id,
        };

        // Act
        var response = await _client.PutAsJsonAsync(url, invalidRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateCard_ReturnsInternalServerError_WhenRequestIsMalformed()
    {
        // Arrange
        var card = await _dbContext.Cards.FirstAsync();
        var url = $"{_cardsEndpoint}/{card.Id}";
        var malformedRequest = new StringContent("Foo", Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PutAsync(url, malformedRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task DeleteCardById_ReturnsNoContent_WhenCardIsDeleted()
    {
        // Arrange
        var card = await _dbContext.Cards.FirstAsync();
        var url = $"{_cardsEndpoint}/{card.Id}";

        // Act
        var response = await _client.DeleteAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        card = await _dbContext.Cards.FirstOrDefaultAsync(c => c.Id == card.Id);
        card.Should().BeNull();
    }

    [Fact]
    public async Task DeleteCardById_ReturnsNotFound_WhenCardDoesNotExist()
    {
        // Arrange
        var url = $"{_cardsEndpoint}/1000000";

        // Act
        var response = await _client.DeleteAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteCardById_ReturnsInternalServerError_WhenCardIdIsntValid()
    {
        // Arrange
        var url = $"{_cardsEndpoint}/foo";

        // Act
        var response = await _client.DeleteAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    public static List<object[]> CreateCardInvalidTestData()
    {
        return
        [
            [
                new CreateCardRequest
                {
                    Name = "h",
                    Description = "Description",
                    Priority = "Low",
                    DueDate = DateTime.UtcNow.AddDays(10),
                    ListId = 1,
                }
            ],
            [
                new CreateCardRequest
                {
                    Name = "Name",
                    Description = null!,
                    Priority = "Low",
                    DueDate = DateTime.UtcNow.AddDays(10),
                    ListId = 1,
                }
            ],
            [
                new CreateCardRequest
                {
                    Name = "Name",
                    Description = "Description",
                    Priority = "Foo",
                    DueDate = DateTime.UtcNow.AddDays(10),
                    ListId = 1,
                }
            ],
            [
                new CreateCardRequest
                {
                    Name = "Name",
                    Description = "Description",
                    Priority = "Low",
                    DueDate = DateTime.UtcNow.AddDays(-10),
                    ListId = 1,
                }
            ],
            [
                new CreateCardRequest
                {
                    Name = "Name",
                    Description = "Description",
                    Priority = "Low",
                    DueDate = DateTime.UtcNow.AddDays(10),
                    ListId = 1_000_000,
                }
            ],
        ];
    }

    public static List<object[]> UpdateCardInvalidTestData()
    {
        return
        [
            [
                new UpdateCardRequest
                {
                    Name = "h",
                    Description = "Description",
                    Priority = "Low",
                    DueDate = DateTime.UtcNow.AddDays(10),
                    ListId = 1,
                }
            ],
            [
                new UpdateCardRequest
                {
                    Name = "Name",
                    Description = null!,
                    Priority = "Low",
                    DueDate = DateTime.UtcNow.AddDays(10),
                    ListId = 1,
                }
            ],
            [
                new UpdateCardRequest
                {
                    Name = "Name",
                    Description = "Description",
                    Priority = "Foo",
                    DueDate = DateTime.UtcNow.AddDays(10),
                    ListId = 1,
                }
            ],
            [
                new UpdateCardRequest
                {
                    Name = "Name",
                    Description = "Description",
                    Priority = "Low",
                    DueDate = DateTime.UtcNow.AddDays(10),
                    ListId = 1_000_000,
                }
            ],
        ];
    }
}