using TaskBoard.DAL.Entities;

namespace TaskBoard.DAL.Repositories.Interfaces;

public interface ICardRepository
{
    Task<Card?> GetByIdAsync(int id);

    Task<Card?> GetWithListByIdAsync(int id);

    void Add(Card card);

    void Remove(Card card);
}