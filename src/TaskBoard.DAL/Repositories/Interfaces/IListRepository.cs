using TaskBoard.DAL.Entities;

namespace TaskBoard.DAL.Repositories.Interfaces;

public interface IListRepository
{
    Task<List?> GetByIdAsync(int id);

    Task<List<List>> GetByBoardIdAsync(int boardId);

    void Add(List list);

    void Remove(List list);
}