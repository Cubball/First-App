using ErrorOr;
using TaskBoard.BLL.Models.CardState;

namespace TaskBoard.BLL.Services.Interfaces;

public interface IHistoryService
{
    Task<ErrorOr<CardsChangesListModel>> GetCardChangesAsync(GetCardsChangesModel model);

    Task<IEnumerable<CardChangeModel>> GetAllChangesByCardIdAsync(int id);
}