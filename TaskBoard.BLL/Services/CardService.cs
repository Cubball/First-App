using ErrorOr;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskBoard.BLL.Infrastructure;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models.Card;
using TaskBoard.BLL.Models.List;
using TaskBoard.BLL.Services.Interfaces;
using TaskBoard.DAL.Data;
using TaskBoard.DAL.Entities;

namespace TaskBoard.BLL.Services;

public class CardService : ICardService
{
    private readonly TaskBoardDbContext _dbContext;
    private readonly IValidator<CreateCardModel> _createCardValidator;
    private readonly IValidator<UpdateCardModel> _updateCardValidator;
    private readonly IDateTimeProvider _dateTimeProvider;

    public CardService(
        TaskBoardDbContext dbContext,
        IValidator<CreateCardModel> createCardValidator,
        IValidator<UpdateCardModel> updateCardValidator,
        IDateTimeProvider dateTimeProvider)
    {
        _dbContext = dbContext;
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

        var list = await _dbContext.Lists.FindAsync(cardModel.ListId);
        if (list is null)
        {
            return Error.Validation(nameof(CreateCardModel.ListId), $"List with Id {cardModel.ListId} does not exist");
        }

        var card = cardModel.ToEntity();
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            await AddCardAndCardStateAsync(card, list);
            await transaction.CommitAsync();
            card.List = list;
            return card.ToFullModel();
        }
        catch
        {
            await transaction.RollbackAsync();
            return Error.Failure();
        }
    }

    public async Task<ErrorOr<Deleted>> DeleteCardByIdAsync(int id)
    {
        var card = await _dbContext.Cards
            .Include(c => c.List)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (card is null)
        {
            return Error.NotFound();
        }

        var cardState = await CreateCardStateFromCardAsync(card, card.List, true);
        _dbContext.Cards.Remove(card);
        _dbContext.CardStates.Add(cardState);
        try
        {
            await _dbContext.SaveChangesAsync();
            return Result.Deleted;
        }
        catch
        {
            return Error.Failure();
        }
    }

    public async Task<IEnumerable<ListWithCardsModel>> GetAllCardsAsync()
    {
        var listsWithCards = await _dbContext.Lists
            .Include(l => l.Cards)
            .ToListAsync();
        var listModels = listsWithCards.Select(l => l.ToModelWithCards()).ToList();
        listModels.ForEach(l => l.Cards.Sort((c1, c2) => c1.DueDate.CompareTo(c2.DueDate)));
        return listModels;
    }

    public async Task<ErrorOr<CardFullModel>> GetCardByIdAsync(int id)
    {
        var card = await _dbContext.Cards
            .Include(c => c.List)
            .FirstOrDefaultAsync(c => c.Id == id);
        return card is null ? Error.NotFound() : card.ToFullModel();
    }

    public async Task<ErrorOr<Updated>> UpdateCardAsync(UpdateCardModel cardModel)
    {
        var validationResult = await _updateCardValidator.ValidateAsync(cardModel);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<Updated>();
        }

        var card = await _dbContext.Cards
            .FirstOrDefaultAsync(c => c.Id == cardModel.Id);
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
        var previousState = await _dbContext.CardStates
            .OrderByDescending(cs => cs.UpdatedAt)
            .FirstOrDefaultAsync(cs => cs.CardId == card.Id);
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
        };
    }

    private async Task AddCardAndCardStateAsync(Card card, List list)
    {
        _dbContext.Cards.Add(card);
        await _dbContext.SaveChangesAsync();
        var cardState = await CreateCardStateFromCardAsync(card, list, false);
        _dbContext.CardStates.Add(cardState);
        await _dbContext.SaveChangesAsync();
    }

    private async Task<ErrorOr<Updated>> UpdateCardAndAddCardStateAsync(Card card, UpdateCardModel cardModel)
    {
        var list = await _dbContext.Lists.FirstOrDefaultAsync(l => l.Id == cardModel.ListId);
        if (list is null)
        {
            return Error.Validation(nameof(CreateCardModel.ListId), $"List with Id {cardModel.ListId} does not exist");
        }

        UpdateCardProperties(card, cardModel);
        var cardState = await CreateCardStateFromCardAsync(card, list, false);
        _dbContext.CardStates.Add(cardState);
        try
        {
            await _dbContext.SaveChangesAsync();
            return Result.Updated;
        }
        catch
        {
            return Error.Failure();
        }
    }
}