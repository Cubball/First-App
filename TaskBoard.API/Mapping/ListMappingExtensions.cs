using TaskBoard.API.Contracts.Responses;
using TaskBoard.BLL.Models;

namespace TaskBoard.API.Mapping;

public static class ListMappingExtensions
{
    public static ListWithCardsResponse ToListWithCardsResponse(this ListWithCardsModel list)
    {
        return new()
        {
            Id = list.List.Id,
            Name = list.List.Name,
            Cards = list.Cards.Select(card => card.ToShortResponse()),
        };
    }

    public static AllCardsResponse ToAllCardsResponse(this IEnumerable<ListWithCardsModel> lists)
    {
        return new() { Lists = lists.Select(l => l.ToListWithCardsResponse()) };
    }
}