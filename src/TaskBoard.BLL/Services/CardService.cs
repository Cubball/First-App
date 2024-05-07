using ErrorOr;
using FluentValidation;
using TaskBoard.BLL.Infrastructure;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models.Card;
using TaskBoard.BLL.Services.Interfaces;
using TaskBoard.DAL.Entities;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.BLL.Services;

public class CardService : ICardService
{
    private readonly ICardRepository _cardRepository;
    private readonly IListRepository _listRepository;
    private readonly ICardStateRepository _cardStateRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateCardModel> _createCardValidator;
    private readonly IValidator<UpdateCardModel> _updateCardValidator;
    private readonly IDateTimeProvider _dateTimeProvider;

    public CardService(
        ICardRepository cardRepository,
        IListRepository listRepository,
        ICardStateRepository cardStateRepository,
        IUnitOfWork unitOfWork,
        IValidator<CreateCardModel> createCardValidator,
        IValidator<UpdateCardModel> updateCardValidator,
        IDateTimeProvider dateTimeProvider)
    {
        _cardRepository = cardRepository;
        _listRepository = listRepository;
        _cardStateRepository = cardStateRepository;
        _unitOfWork = unitOfWork;
        _createCardValidator = createCardValidator;
        _updateCardValidator = updateCardValidator;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<ErrorOr<CardFullModel>> CreateCardAsync(CreateCardModel cardModel)
    {
        var validationResult = await _createCardValidator.ValidateAsync(cardModel);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<CardFullModel>();
        }

        var list = await _listRepository.GetByIdAsync(cardModel.ListId);
        if (list is null)
        {
            return Error.Validation(nameof(CreateCardModel.ListId), $"List with Id {cardModel.ListId} does not exist");
        }

        var card = cardModel.ToEntity();
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            await AddCardAndCardStateAsync(card, list);
            await _unitOfWork.CommitTransactionAsync();
            card.List = list;
            return card.ToFullModel();
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            return Error.Failure();
        }
    }

    public async Task<ErrorOr<Deleted>> DeleteCardByIdAsync(int id)
    {
        var card = await _cardRepository.GetWithListByIdAsync(id);
        if (card is null)
        {
            return Error.NotFound();
        }

        var cardState = await CreateCardStateFromCardAsync(card, card.List, true);
        _cardRepository.Remove(card);
        _cardStateRepository.Add(cardState);
        try
        {
            await _unitOfWork.SaveChangesAsync();
            return Result.Deleted;
        }
        catch
        {
            return Error.Failure();
        }
    }

    public async Task<ErrorOr<CardFullModel>> GetCardByIdAsync(int id)
    {
        var card = await _cardRepository.GetWithListByIdAsync(id);
        return card is null ? Error.NotFound() : card.ToFullModel();
    }

    public async Task<ErrorOr<Updated>> UpdateCardAsync(UpdateCardModel cardModel)
    {
        var validationResult = await _updateCardValidator.ValidateAsync(cardModel);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<Updated>();
        }

        var card = await _cardRepository.GetWithListByIdAsync(cardModel.Id);
        if (card is null)
        {
            return Error.NotFound();
        }

        if (!DidPropertiesChange(card, cardModel))
        {
            return Result.Updated;
        }

        return await UpdateCardAndAddCardStateAsync(card, cardModel);
    }

    private static void UpdateCardProperties(Card card, UpdateCardModel cardModel)
    {
        card.Name = cardModel.Name;
        card.Description = cardModel.Description;
        card.DueDate = cardModel.DueDate;
        card.Priority = cardModel.Priority;
        card.ListId = cardModel.ListId;
    }

    private static bool DidPropertiesChange(Card card, UpdateCardModel cardModel)
    {
        return card.Name != cardModel.Name
            || card.Description != cardModel.Description
            || card.DueDate != cardModel.DueDate
            || card.Priority != cardModel.Priority
            || card.ListId != cardModel.ListId;
    }

    private async Task<CardState> CreateCardStateFromCardAsync(Card card, List list, bool deleted)
    {
        var previousState = await _cardStateRepository.GetLatestByCardIdAsync(card.Id);
        return new()
        {
            CardId = card.Id,
            Name = card.Name,
            Description = card.Description,
            DueDate = card.DueDate,
            Priority = card.Priority,
            ListId = list.Id,
            ListName = list.Name,
            UpdatedAt = _dateTimeProvider.UtcNow,
            Deleted = deleted,
            PreviousState = previousState,
            BoardId = list.BoardId,
        };
    }

    private async Task AddCardAndCardStateAsync(Card card, List list)
    {
        _cardRepository.Add(card);
        await _unitOfWork.SaveChangesAsync();
        var cardState = await CreateCardStateFromCardAsync(card, list, false);
        _cardStateRepository.Add(cardState);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task<ErrorOr<Updated>> UpdateCardAndAddCardStateAsync(Card card, UpdateCardModel cardModel)
    {
        var list = await _listRepository.GetByIdAsync(cardModel.ListId);
        if (list is null)
        {
            return Error.Validation(nameof(UpdateCardModel.ListId), $"List with Id {cardModel.ListId} does not exist");
        }

        if (list.BoardId != card.List.BoardId)
        {
            return Error.Validation(nameof(UpdateCardModel.ListId), $"Cannot move card to list with Id {cardModel.ListId} since it's in a different board");
        }

        UpdateCardProperties(card, cardModel);
        var cardState = await CreateCardStateFromCardAsync(card, list, false);
        _cardStateRepository.Add(cardState);
        try
        {
            await _unitOfWork.SaveChangesAsync();
            return Result.Updated;
        }
        catch
        {
            return Error.Failure();
        }
    }
}