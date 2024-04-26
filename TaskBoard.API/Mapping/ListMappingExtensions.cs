using TaskBoard.API.Contracts.Responses.Card;
using TaskBoard.API.Contracts.Responses.List;
using TaskBoard.BLL.Models.List;

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

    public static ListResponse ToResponse(this ListModel list)
    {
        return new()
        {
            Id = list.Id,
            Name = list.Name,
        };
    }

    public static AllListsResponse ToAllListsResponse(this IEnumerable<ListModel> lists)
    {
        return new() { Lists = lists.Select(l => l.ToResponse()) };
    }
}