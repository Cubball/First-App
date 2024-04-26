using ErrorOr;
using TaskBoard.BLL.Models.CardState;

namespace TaskBoard.BLL.Services;

public interface IHistoryService
{
    Task<ErrorOr<CardsChangesListModel>> GetCardChangesAsync(GetCardsChangesModel model);
}