using ErrorOr;
using TaskBoard.BLL.Models.Card;

namespace TaskBoard.BLL.Services.Interfaces;

public interface ICardService
{
    Task<ErrorOr<CardFullModel>> GetCardByIdAsync(int id);

    Task<ErrorOr<CardFullModel>> CreateCardAsync(CreateCardModel cardModel);

    Task<ErrorOr<Updated>> UpdateCardAsync(UpdateCardModel cardModel);

    Task<ErrorOr<Deleted>> DeleteCardByIdAsync(int id);
}