using TaskBoard.DAL.Entities;

namespace TaskBoard.DAL.Repositories.Interfaces;

public interface IBoardRepository
{
    Task<Board?> GetByIdAsync(int id);

    Task<Board?> GetWithListsAndCardsByIdAsync(int id);

    Task<List<Board>> GetAllAsync();

    void Add(Board board);

    void Remove(Board board);
}