using TaskBoard.DAL.Entities;

namespace TaskBoard.DAL.Repositories.Interfaces;

public interface ICardStateRepository
{
    Task<CardState?> GetLatestByCardIdAsync(int cardId);

    Task<List<CardState>> GetOrderedWithPreviousStateByBoardIdAsync(int boardId, int skip, int take);

    Task<List<CardState>> GetOrderedWithPreviousStateByCardIdAsync(int cardId);

    Task<int> GetCountByBoardIdAsync(int boardId);

    void Add(CardState cardState);
}