using ErrorOr;
using TaskBoard.BLL.Models.Card;
using TaskBoard.BLL.Models.List;

namespace TaskBoard.BLL.Services.Interfaces;

public interface ICardService
{
    Task<IEnumerable<ListWithCardsModel>> GetAllCardsAsync();

    Task<ErrorOr<CardFullModel>> GetCardByIdAsync(int id);

    Task<ErrorOr<CardFullModel>> CreateCardAsync(CreateCardModel cardModel);

    Task<ErrorOr<Updated>> UpdateCardAsync(UpdateCardModel cardModel);

    Task<ErrorOr<Deleted>> DeleteCardByIdAsync(int id);
}