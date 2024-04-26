using ErrorOr;
using TaskBoard.BLL.Models.Card;

namespace TaskBoard.BLL.Services;

public interface ICardService
{
    Task<IEnumerable<ListWithCardsModel>> GetAllCardsAsync();

    Task<ErrorOr<CardFullModel>> GetCardByIdAsync(int id);

    Task<ErrorOr<CardFullModel>> CreateCardAsync(CreateCardModel cardModel);

    Task<ErrorOr<Updated>> UpdateCardAsync(UpdateCardModel cardModel);

    Task<ErrorOr<Deleted>> DeleteCardByIdAsync(int id);
}