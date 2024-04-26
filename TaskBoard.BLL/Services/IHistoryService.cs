using TaskBoard.BLL.Models.CardState;

namespace TaskBoard.BLL.Services;

public interface IHistoryService
{
    Task<CardsChangesListModel> GetCardChangesAsync(int page, int pageSize);
}