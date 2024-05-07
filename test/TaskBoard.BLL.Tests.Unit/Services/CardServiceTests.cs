using ErrorOr;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TaskBoard.BLL.Infrastructure;
using TaskBoard.BLL.Models.Card;
using TaskBoard.BLL.Services;
using TaskBoard.DAL.Entities;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.BLL.Tests.Unit.Services;

public class CardServiceTests
{
    private readonly ICardRepository _mockCardRepository;
    private readonly IListRepository _mockListRepository;
    private readonly ICardStateRepository _mockCardStateRepository;
    private readonly IUnitOfWork _mockUnitOfWork;
    private readonly IValidator<CreateCardModel> _mockCreateCardValidator;
    private readonly IValidator<UpdateCardModel> _mockUpdateCardValidator;
    private readonly IDateTimeProvider _mockDateTimeProvider;
    private readonly CardService _sut;

    public CardServiceTests()
    {
        _mockCardRepository = Substitute.For<ICardRepository>();
        _mockListRepository = Substitute.For<IListRepository>();
        _mockCardStateRepository = Substitute.For<ICardStateRepository>();
        _mockUnitOfWork = Substitute.For<IUnitOfWork>();
        _mockCreateCardValidator = Substitute.For<IValidator<CreateCardModel>>();
        _mockUpdateCardValidator = Substitute.For<IValidator<UpdateCardModel>>();
        _mockDateTimeProvider = Substitute.For<IDateTimeProvider>();
        _sut = new(
            _mockCardRepository,
            _mockListRepository,
            _mockCardStateRepository,
            _mockUnitOfWork,
            _mockCreateCardValidator,
            _mockUpdateCardValidator,
            _mockDateTimeProvider
        );
    }

    [Fact]
    public async Task GetCardByIdAsync_ReturnsNotFound_WhenCardDoesNotExist()
    {
        // Arrange
        const int cardId = 1;
        _mockCardRepository.GetWithListByIdAsync(Arg.Is(cardId)).Returns(Task.FromResult<Card?>(null));

        // Act
        var result = await _sut.GetCardByIdAsync(cardId);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.NotFound);
    }
    [Fact]
    public async Task GetCardByIdAsync_ReturnsCard_WhenCardExists()
    {
        // Arrange
        const int cardId = 1;
        var card = GetCardWithList(cardId);
        var expectedModel = GetExpectedModelFromCard(card);
        _mockCardRepository.GetWithListByIdAsync(Arg.Is(cardId)).Returns(Task.FromResult<Card?>(card));

        // Act
        var result = await _sut.GetCardByIdAsync(cardId);

        // Assert
        result.IsError.Should().BeFalse();
        result.Value.Should().BeEquivalentTo(expectedModel);
    }

    [Fact]
    public async Task CreateCardAsync_ReturnsValidationErrors_WhenModelIsInvalid()
    {
        // Arrange
        var model = GetCreateCardModel();
        _mockCreateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult([new ValidationFailure()])));

        // Act
        var result = await _sut.CreateCardAsync(model);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Validation);
    }

    [Fact]
    public async Task CreateCardAsync_ReturnsValidationErrors_WhenListWithProvidedIdDoesNotExist()
    {
        // Arrange
        var model = GetCreateCardModel();
        _mockCreateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(null));

        // Act
        var result = await _sut.CreateCardAsync(model);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Validation);
    }

    [Fact]
    public async Task CreateCardAsync_ReturnsFailureError_WhenExceptionIsThrownWhenSaving()
    {
        // Arrange
        var model = GetCreateCardModel();
        var list = GetList(model.ListId);
        _mockCreateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockUnitOfWork.SaveChangesAsync().ThrowsAsync(new Exception());
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(list));

        // Act
        var result = await _sut.CreateCardAsync(model);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Failure);
    }

    [Fact]
    public async Task CreateCardAsync_ReturnsCard_WhenCardIsCreated()
    {
        // Arrange
        const int cardId = 1;
        Card createdCard = null!;
        var model = GetCreateCardModel();
        var list = GetList(model.ListId);
        var expectedModel = GetExpcetedModelFromCreateModel(cardId, model, list);
        _mockCreateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(list));
        _mockCardRepository.Add(Arg.Do<Card>(c => createdCard = c));
        _mockUnitOfWork
            .When(uof => uof.SaveChangesAsync())
            .Do((_) => createdCard.Id = cardId);

        // Act
        var result = await _sut.CreateCardAsync(model);

        // Assert
        result.IsError.Should().BeFalse();
        result.Value.Should().BeEquivalentTo(expectedModel);
    }

    [Fact]
    public async Task CreateCardAsync_AddsCardState_WhenCardIsCreated()
    {
        // Arrange
        const int cardId = 1;
        Card createdCard = null!;
        var model = GetCreateCardModel();
        var list = GetList(model.ListId);
        var dateTime = new DateTime(2024, 6, 9);
        _mockCreateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(list));
        _mockDateTimeProvider.UtcNow.Returns(dateTime);
        _mockCardRepository.Add(Arg.Do<Card>(c => createdCard = c));
        _mockUnitOfWork
            .When(uof => uof.SaveChangesAsync())
            .Do((_) => createdCard.Id = cardId);

        // Act
        var result = await _sut.CreateCardAsync(model);

        // Assert
        _mockCardStateRepository
            .Received()
            .Add(
                Arg.Is<CardState>(cs =>
                    cs.CardId == cardId
                    && cs.Name == model.Name
                    && cs.Description == model.Description
                    && cs.DueDate == model.DueDate
                    && cs.Priority == model.Priority
                    && cs.ListId == list.Id
                    && cs.ListName == list.Name
                    && cs.UpdatedAt == dateTime
                    && !cs.Deleted
                    && cs.PreviousStateId == null
                    && cs.PreviousState == null
                    && cs.BoardId == list.BoardId
                )
            );
    }

    [Fact]
    public async Task UpdateCardAsync_ReturnsValidationErrors_WhenModelIsInvalid()
    {
        // Arrange
        var model = GetUpdateCardModel();
        _mockUpdateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult([new ValidationFailure()])));

        // Act
        var result = await _sut.UpdateCardAsync(model);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Validation);
    }

    [Fact]
    public async Task UpdateCardAsync_ReturnsValidationErrors_WhenListWithProvidedIdDoesNotExist()
    {
        // Arrange
        var model = GetUpdateCardModel();
        var card = GetCardWithList(model.Id);
        _mockUpdateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockCardRepository
            .GetWithListByIdAsync(model.Id)
            .Returns(Task.FromResult<Card?>(card));
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(null));

        // Act
        var result = await _sut.UpdateCardAsync(model);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Validation);
    }

    [Fact]
    public async Task UpdateCardAsync_ReturnsValidationErrors_WhenNewListIsInDifferentBoard()
    {
        // Arrange
        var model = GetUpdateCardModel();
        var card = GetCardWithList(model.Id);
        _mockUpdateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockCardRepository
            .GetWithListByIdAsync(model.Id)
            .Returns(Task.FromResult<Card?>(card));
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(new List { Id = 2, Name = "Name", BoardId = 2 }));

        // Act
        var result = await _sut.UpdateCardAsync(model);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Validation);
    }

    [Fact]
    public async Task UpdateCardAsync_ReturnsFailureError_WhenExceptionIsThrownWhenSaving()
    {
        // Arrange
        var model = GetUpdateCardModel();
        var card = GetCardWithList(model.Id);
        _mockUpdateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockCardRepository
            .GetWithListByIdAsync(model.Id)
            .Returns(Task.FromResult<Card?>(card));
        _mockUnitOfWork.SaveChangesAsync().ThrowsAsync(new Exception());
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(card.List));

        // Act
        var result = await _sut.UpdateCardAsync(model);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Failure);
    }

    [Fact]
    public async Task UpdateCardAsync_ReturnsUpdated_WhenCardIsUpdated()
    {
        // Arrange
        var model = GetUpdateCardModel();
        var card = GetCardWithList(model.Id);
        _mockUpdateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockCardRepository
            .GetWithListByIdAsync(model.Id)
            .Returns(Task.FromResult<Card?>(card));
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(card.List));

        // Act
        var result = await _sut.UpdateCardAsync(model);

        // Assert
        result.IsError.Should().BeFalse();
        result.Value.Should().Be(Result.Updated);
    }

    [Fact]
    public async Task UpdateCardAsync_AddsCardState_WhenCardIsUpdated()
    {
        // Arrange
        var model = GetUpdateCardModel();
        var card = GetCardWithList(model.Id);
        var state = new CardState();
        var dateTime = new DateTime(2024, 6, 9);
        _mockUpdateCardValidator
            .ValidateAsync(model)
            .Returns(Task.FromResult(new ValidationResult()));
        _mockCardRepository
            .GetWithListByIdAsync(model.Id)
            .Returns(Task.FromResult<Card?>(card));
        _mockListRepository
            .GetByIdAsync(model.ListId)
            .Returns(Task.FromResult<List?>(card.List));
        _mockDateTimeProvider.UtcNow.Returns(dateTime);
        _mockCardStateRepository
            .GetLatestByCardIdAsync(model.Id)
            .Returns(state);

        // Act
        var result = await _sut.UpdateCardAsync(model);

        // Assert
        _mockCardStateRepository
            .Received()
            .Add(
                Arg.Is<CardState>(cs =>
                    cs.CardId == model.Id
                    && cs.Name == model.Name
                    && cs.Description == model.Description
                    && cs.DueDate == model.DueDate
                    && cs.Priority == model.Priority
                    && cs.ListId == card.List.Id
                    && cs.ListName == card.List.Name
                    && cs.UpdatedAt == dateTime
                    && !cs.Deleted
                    && cs.PreviousState == state
                    && cs.BoardId == card.List.BoardId
                )
            );
    }

    [Fact]
    public async Task DeleteCardByIdAsync_ReturnsNotFound_WhenCardDoesNotExist()
    {
        // Arrange
        const int cardId = 1;
        _mockCardRepository
            .GetWithListByIdAsync(cardId)
            .Returns(Task.FromResult<Card?>(null));

        // Act
        var result = await _sut.DeleteCardByIdAsync(cardId);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.NotFound);
    }

    [Fact]
    public async Task DeleteCardByIdAsync_ReturnsFailureError_WhenExceptionIsThrownWhenSaving()
    {
        // Arrange
        const int cardId = 1;
        var card = GetCardWithList(cardId);
        _mockCardRepository
            .GetWithListByIdAsync(cardId)
            .Returns(Task.FromResult<Card?>(card));
        _mockUnitOfWork
            .SaveChangesAsync()
            .ThrowsAsync(new Exception());

        // Act
        var result = await _sut.DeleteCardByIdAsync(cardId);

        // Assert
        result.IsError.Should().BeTrue();
        result.Errors.Should().HaveCount(1).And.Satisfy(e => e.Type == ErrorType.Failure);
    }

    [Fact]
    public async Task DeleteCardByIdAsync_ReturnsDeleted_WhenCardIsDeleted()
    {
        // Arrange
        const int cardId = 1;
        var card = GetCardWithList(cardId);
        _mockCardRepository
            .GetWithListByIdAsync(cardId)
            .Returns(Task.FromResult<Card?>(card));

        // Act
        var result = await _sut.DeleteCardByIdAsync(cardId);

        // Assert
        result.IsError.Should().BeFalse();
        result.Value.Should().Be(Result.Deleted);
    }

    [Fact]
    public async Task DeleteCardByIdAsync_AddsCardState_WhenCardIsDeleted()
    {
        // Arrange
        const int cardId = 1;
        var card = GetCardWithList(cardId);
        var state = new CardState();
        var dateTime = new DateTime(2024, 6, 9);
        _mockCardRepository
            .GetWithListByIdAsync(cardId)
            .Returns(Task.FromResult<Card?>(card));
        _mockCardStateRepository
            .GetLatestByCardIdAsync(cardId)
            .Returns(Task.FromResult<CardState?>(state));
        _mockDateTimeProvider.UtcNow.Returns(dateTime);

        // Act
        var result = await _sut.DeleteCardByIdAsync(cardId);

        // Assert
        _mockCardStateRepository
            .Received()
            .Add(
                Arg.Is<CardState>(cs =>
                    cs.CardId == cardId
                    && cs.PreviousState == state
                    && cs.Deleted
                    && cs.UpdatedAt == dateTime
               )
            );
    }

    private static CreateCardModel GetCreateCardModel()
    {
        return new CreateCardModel
        {
            Name = "Card",
            Description = string.Empty,
            Priority = "High",
            DueDate = new DateTime(2020, 1, 1),
            ListId = 1,
        };
    }

    private static Card GetCardWithList(int cardId)
    {
        return new Card
        {
            Id = cardId,
            Name = "Card",
            Description = string.Empty,
            Priority = "Low",
            DueDate = new DateTime(2020, 1, 1),
            ListId = 1,
            List = new()
            {
                Id = 1,
                Name = "List",
            }
        };
    }

    private static CardFullModel GetExpectedModelFromCard(Card card)
    {
        return new CardFullModel
        {
            Id = card.Id,
            Name = card.Name,
            Description = card.Description,
            DueDate = card.DueDate,
            Priority = card.Priority,
            List = new()
            {
                Id = card.List.Id,
                Name = card.List.Name,
            },
        };
    }

    private static List GetList(int listId)
    {
        return new()
        {
            Id = listId,
            Name = "List",
            BoardId = 1,
        };
    }

    private static CardFullModel GetExpcetedModelFromCreateModel(int cardId, CreateCardModel model, List list)
    {
        return new CardFullModel
        {
            Id = cardId,
            Name = model.Name,
            Description = model.Description,
            DueDate = model.DueDate,
            Priority = model.Priority,
            List = new()
            {
                Id = list.Id,
                Name = list.Name,
            },
        };
    }

    private static UpdateCardModel GetUpdateCardModel()
    {
        return new UpdateCardModel
        {
            Id = 1,
            Name = "Card New Name",
            Description = string.Empty,
            Priority = "High",
            DueDate = new DateTime(2020, 1, 1),
            ListId = 1,
        };
    }
}