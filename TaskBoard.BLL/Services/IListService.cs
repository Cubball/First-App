using ErrorOr;
using TaskBoard.BLL.Models;

namespace TaskBoard.BLL.Services;

public interface IListService
{
    Task<IEnumerable<ListModel>> GetAllListsAsync();

    Task<ErrorOr<ListModel>> CreateListAsync(CreateListModel listModel);

    Task<ErrorOr<Updated>> UpdateListAsync(UpdateListModel listModel);

    Task<ErrorOr<Deleted>> DeleteListByIdAsync(int id);
}