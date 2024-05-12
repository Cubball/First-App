using ErrorOr;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using NSubstitute;
using TaskBoard.BLL.Models.CardState;
using TaskBoard.BLL.Services;
using TaskBoard.DAL.Entities;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.BLL.Tests.Unit.Services;

public class HistoryServiceTests
{
    private readonly ICardStateRepository _mockCardStateRepository;
    private readonly IValidator<GetCardsChangesModel> _mockValidator;
    private readonly HistoryService _sut;

    public HistoryServiceTests()
    {
        _mockCardStateRepository = Substitute.For<ICardStateRepository>();
        _mockValidator = Substitute.For<IValidator<GetCardsChangesModel>>();
        _sut = new(_mockCardStateRepository, _mockValidator);
    }

    [Fact]
    public async Task GetCardChangesAsync_ReturnsValidationErrors_WhenParamsAreInvalid()
    {
        // Arrange
        var getCardsChangesModel = new GetCardsChangesModel();
        _mockValidator
            .Validate(getCardsChangesModel)
            .Returns(new ValidationResult([new ValidationFailure()]));

        // Act
        var result = await _sut.GetCardChangesAsync(getCardsChangesModel);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Validation);
    }

    [Theory]
    [MemberData(nameof(GetCardChangesAsyncTestData))]
    public async Task GetCardChangesAsync_ReturnsCorrectChanges_WhenParamsAreValid(
        int skip,
        int take,
        GetCardsChangesModel getCardsChangesModel,
        List<CardState> states,
        CardsChangesListModel expectedCardChangesList)
    {
        // Arrange
        _mockValidator.Validate(getCardsChangesModel).Returns(new ValidationResult());
        _mockCardStateRepository
            .GetOrderedWithPreviousStateByBoardIdAsync(getCardsChangesModel.BoardId, skip, take)
            .Returns(Task.FromResult(states));
        _mockCardStateRepository
            .GetCountByBoardIdAsync(getCardsChangesModel.BoardId)
            .Returns(Task.FromResult(expectedCardChangesList.TotalItems));

        // Act
        var result = await _sut.GetCardChangesAsync(getCardsChangesModel);

        // Assert
        result.IsError.Should().BeFalse();
        result.Value.Should().BeEquivalentTo(expectedCardChangesList);
    }

    [Theory]
    [MemberData(nameof(GetAllChangesByCardIdAsyncTestData))]
    public async Task GetAllChangesByCardIdAsync_ReturnsCorrectChanges_WhenCardIsDeleted(
        int cardId,
        List<CardState> states,
        List<CardChangeModel> expectedChanges)
    {
        // Arrange
        _mockCardStateRepository.GetOrderedWithPreviousStateByCardIdAsync(Arg.Is(cardId)).Returns(states);

        // Act
        var actualChanges = await _sut.GetAllChangesByCardIdAsync(cardId);

        // Assert
        actualChanges.Should().BeEquivalentTo(expectedChanges);
    }

    public static List<object[]> GetCardChangesAsyncTestData()
    {
        var (states, expectedChanges) = GetCardStatesAndExpectedChangesForBoard();
        return
        [
            [
                0,
                4,
                new GetCardsChangesModel { Page = 1, PageSize = 4, BoardId = 1 },
                states,
                new CardsChangesListModel { PageNumber = 1, PageSize = 4, TotalItems = 4, Items = expectedChanges }
            ],
            [
                4,
                4,
                new GetCardsChangesModel { Page = 2, PageSize = 4, BoardId = 1 },
                states,
                new CardsChangesListModel { PageNumber = 2, PageSize = 4, TotalItems = 8, Items = expectedChanges }
            ],
            [
                0,
                10,
                new GetCardsChangesModel { Page = 1, PageSize = 10, BoardId = 1 },
                states,
                new CardsChangesListModel { PageNumber = 1, PageSize = 10, TotalItems = 4, Items = expectedChanges }
            ],
            [
                0,
                10,
                new GetCardsChangesModel { Page = 1, PageSize = 10, BoardId = 1 },
                new List<CardState>(),
                new CardsChangesListModel { PageNumber = 1, PageSize = 10, TotalItems = 0, Items = [] }
            ],
            [
                10,
                10,
                new GetCardsChangesModel { Page = 2, PageSize = 10, BoardId = 1 },
                new List<CardState>(),
                new CardsChangesListModel { PageNumber = 2, PageSize = 10, TotalItems = 10, Items = [] }
            ],
        ];
    }

    public static List<object[]> GetAllChangesByCardIdAsyncTestData()
    {
        const int cardId = 1;
        var (statesDeletedCard, changesDeletedCard) = GetCardStatesAndExpectedChangesForDeletedCard(cardId);
        var (states, changes) = GetCardStatesAndExpectedChangesForCard(cardId);
        return
        [
            [cardId, states, changes],
            [cardId, states, changes],
            [cardId, new List<CardState>(), new List<CardChangeModel>()]
        ];
    }

    private static (List<CardState>, List<CardChangeModel>) GetCardStatesAndExpectedChangesForBoard()
    {
        var states = new List<CardState>
        {
            new()
            {
                Id = 4,
                CardId = 1,
                Name = "Name 1 Modified",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "High",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 4),
                Deleted = false,
                BoardId = 1
            },
            new()
            {
                Id = 3,
                CardId = 2,
                Name = "Name 2 Modified",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "High",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 3),
                Deleted = false,
                BoardId = 1
            },
            new()
            {
                Id = 2,
                CardId = 2,
                Name = "Name 2",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "Low",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 2),
                Deleted = false,
                BoardId = 1
            },
            new()
            {
                Id = 1,
                CardId = 1,
                Name = "Name 1",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "Low",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 1),
                Deleted = false,
                BoardId = 1
            }
        };
        states[0].PreviousState = states[3];
        states[1].PreviousState = states[2];

        var changes = new List<CardChangeModel>
        {
            new()
            {
                CardId = 1,
                UpdatedAt = new DateTime(2024, 1, 4),
                CurrentState = new()
                {
                    Name = "Name 1 Modified",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "High",
                    ListId = 1,
                    ListName = "List 1",
                },
                PreviousState = new()
                {
                    Name = "Name 1",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "Low",
                    ListId = 1,
                    ListName = "List 1",
                }
            },
            new()
            {
                CardId = 2,
                UpdatedAt = new DateTime(2024, 1, 3),
                CurrentState = new()
                {
                    Name = "Name 2 Modified",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "High",
                    ListId = 1,
                    ListName = "List 1",
                },
                PreviousState = new()
                {
                    Name = "Name 2",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "Low",
                    ListId = 1,
                    ListName = "List 1",
                }
            },
            new()
            {
                CardId = 2,
                UpdatedAt = new DateTime(2024, 1, 2),
                CurrentState = new()
                {
                    Name = "Name 2",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "Low",
                    ListId = 1,
                    ListName = "List 1",
                },
                PreviousState = null
            },
            new()
            {
                CardId = 1,
                UpdatedAt = new DateTime(2024, 1, 1),
                CurrentState = new()
                {
                    Name = "Name 1",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "Low",
                    ListId = 1,
                    ListName = "List 1",
                },
                PreviousState = null
            },
        };
        return (states, changes);
    }

    private static (List<CardState>, List<CardChangeModel>) GetCardStatesAndExpectedChangesForDeletedCard(int cardId)
    {
        var states = new List<CardState>
        {
            new()
            {
                Id = cardId,
                CardId = 1,
                Name = "Name",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "High",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 2),
                Deleted = true,
                BoardId = 1
            },
            new()
            {
                Id = cardId,
                CardId = 1,
                Name = "Name",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "High",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 1),
                Deleted = false,
                BoardId = 1
            }
        };
        states[0].PreviousState = states[1];
        var expectedChanges = new List<CardChangeModel>
        {
            new()
            {
                CardId = cardId,
                UpdatedAt = new DateTime(2024, 1, 2),
                PreviousState = new()
                {
                    Name = "Name",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    ListId = 1,
                    ListName = "List 1",
                    Priority = "High",
                },
                CurrentState = null
            },
            new()
            {
                CardId = cardId,
                UpdatedAt = new DateTime(2024, 1, 1),
                PreviousState = null,
                CurrentState = new()
                {
                    Name = "Name",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    ListId = 1,
                    ListName = "List 1",
                    Priority = "High",
                },
            }
        };
        return (states, expectedChanges);
    }

    private static (List<CardState>, List<CardChangeModel>) GetCardStatesAndExpectedChangesForCard(int cardId)
    {
        var states = new List<CardState>
        {
            new()
            {
                Id = 4,
                CardId = cardId,
                Name = "Name 1 Modified",
                Description = "Some Description",
                DueDate = new DateTime(2020, 1, 1),
                Priority = "High",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 4),
                Deleted = false,
                BoardId = 1
            },
            new()
            {
                Id = 3,
                CardId = cardId,
                Name = "Name 1 Modified",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "High",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 3),
                Deleted = false,
                BoardId = 1
            },
            new()
            {
                Id = 2,
                CardId = cardId,
                Name = "Name 1 Modified",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "Low",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 2),
                Deleted = false,
                BoardId = 1
            },
            new()
            {
                Id = 1,
                CardId = cardId,
                Name = "Name 1",
                Description = string.Empty,
                DueDate = new DateTime(2020, 1, 1),
                Priority = "Low",
                ListId = 1,
                ListName = "List 1",
                UpdatedAt = new DateTime(2024, 1, 1),
                Deleted = false,
                BoardId = 1
            }
        };
        states[0].PreviousState = states[1];
        states[1].PreviousState = states[2];
        states[2].PreviousState = states[3];

        var changes = new List<CardChangeModel>
        {
            new()
            {
                CardId = cardId,
                UpdatedAt = new DateTime(2024, 1, 4),
                CurrentState = new()
                {
                    Name = "Name 1 Modified",
                    Description = "Some Description",
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "High",
                    ListId = 1,
                    ListName = "List 1",
                },
                PreviousState = new()
                {
                    Name = "Name 1 Modified",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "High",
                    ListId = 1,
                    ListName = "List 1",
                }
            },
            new()
            {
                CardId = cardId,
                UpdatedAt = new DateTime(2024, 1, 3),
                CurrentState = new()
                {
                    Name = "Name 1 Modified",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "High",
                    ListId = 1,
                    ListName = "List 1",
                },
                PreviousState = new()
                {
                    Name = "Name 1 Modified",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "Low",
                    ListId = 1,
                    ListName = "List 1",
                }
            },
            new()
            {
                CardId = cardId,
                UpdatedAt = new DateTime(2024, 1, 2),
                CurrentState = new()
                {
                    Name = "Name 1 Modified",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "Low",
                    ListId = 1,
                    ListName = "List 1",
                },
                PreviousState = new()
                {
                    Name = "Name 1",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "Low",
                    ListId = 1,
                    ListName = "List 1",
                }
            },
            new()
            {
                CardId = cardId,
                UpdatedAt = new DateTime(2024, 1, 1),
                CurrentState = new()
                {
                    Name = "Name 1",
                    Description = string.Empty,
                    DueDate = new DateTime(2020, 1, 1),
                    Priority = "Low",
                    ListId = 1,
                    ListName = "List 1",
                },
                PreviousState = null
            },
        };
        return (states, changes);
    }
}