using ErrorOr;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models.CardState;
using TaskBoard.DAL.Data;

namespace TaskBoard.BLL.Services;

public class HistoryService : IHistoryService
{
    private readonly TaskBoardDbContext _dbContext;
    private readonly IValidator<GetCardsChangesModel> _getCardsChangesModelValidator;

    public HistoryService(
        TaskBoardDbContext dbContext,
        IValidator<GetCardsChangesModel> getCardsChangesModelValidator)
    {
        _dbContext = dbContext;
        _getCardsChangesModelValidator = getCardsChangesModelValidator;
    }

    public async Task<IEnumerable<CardChangeModel>> GetAllChangesByCardIdAsync(int id)
    {
        var states = await _dbContext.CardStates
            .Where(s => s.CardId == id)
            .OrderByDescending(s => s.UpdatedAt)
            .ToListAsync();
        for (var i = 0; i < states.Count - 1; i++)
        {
            states[i].PreviousState = states[i + 1];
        }

        return states.Select(s => s.ToChangeModel()).ToList();
    }

    public async Task<ErrorOr<CardsChangesListModel>> GetCardChangesAsync(GetCardsChangesModel model)
    {
        var validationResult = _getCardsChangesModelValidator.Validate(model);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<CardsChangesListModel>();
        }

        var skip = (model.Page - 1) * model.PageSize;
        var states = await _dbContext.CardStates
            .Include(s => s.PreviousState)
            .OrderByDescending(s => s.UpdatedAt)
            .Skip(skip)
            .Take(model.PageSize)
            .ToListAsync();
        var cardChanges = states.Select(s => s.ToChangeModel()).ToList();
        var totalItems = await _dbContext.CardStates.CountAsync();
        return new CardsChangesListModel()
        {
            PageSize = model.PageSize,
            PageNumber = model.Page,
            TotalItems = totalItems,
            Items = cardChanges,
        };
    }
}