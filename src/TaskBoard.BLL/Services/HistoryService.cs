using ErrorOr;
using FluentValidation;
using TaskBoard.BLL.Mapping;
using TaskBoard.BLL.Models.CardState;
using TaskBoard.BLL.Services.Interfaces;
using TaskBoard.DAL.Repositories.Interfaces;

namespace TaskBoard.BLL.Services;

public class HistoryService : IHistoryService
{
    private readonly ICardStateRepository _cardStateRepository;
    private readonly IValidator<GetCardsChangesModel> _getCardsChangesModelValidator;

    public HistoryService(
        ICardStateRepository cardStateRepository,
        IValidator<GetCardsChangesModel> getCardsChangesModelValidator)
    {
        _cardStateRepository = cardStateRepository;
        _getCardsChangesModelValidator = getCardsChangesModelValidator;
    }

    public async Task<IEnumerable<CardChangeModel>> GetAllChangesByCardIdAsync(int id)
    {
        var states = await _cardStateRepository.GetOrderedWithPreviousStateByCardIdAsync(id);
        return states.ConvertAll(s => s.ToChangeModel());
    }

    public async Task<ErrorOr<CardsChangesListModel>> GetCardChangesAsync(GetCardsChangesModel model)
    {
        var validationResult = _getCardsChangesModelValidator.Validate(model);
        if (!validationResult.IsValid)
        {
            return validationResult.ToValidationErrors<CardsChangesListModel>();
        }

        var skip = (model.Page - 1) * model.PageSize;
        var states = await _cardStateRepository.GetOrderedWithPreviousStateByBoardIdAsync(model.BoardId, skip, model.PageSize);
        var cardChanges = states.ConvertAll(s => s.ToChangeModel());
        var totalItems = await _cardStateRepository.GetCountByBoardIdAsync(model.BoardId);
        return new CardsChangesListModel()
        {
            PageSize = model.PageSize,
            PageNumber = model.Page,
            TotalItems = totalItems,
            Items = cardChanges,
        };
    }
}