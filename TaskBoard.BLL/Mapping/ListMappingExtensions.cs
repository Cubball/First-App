using TaskBoard.BLL.Models;
using TaskBoard.DAL.Entities;

namespace TaskBoard.BLL.Mapping;

public static class ListMappingExtensions
{
    public static ListModel ToModel(this List list)
    {
        return new ListModel
        {
            Id = list.Id,
            Name = list.Name,
        };
    }

    public static ListWithCardsModel ToModelWithCards(this List list)
    {
        return new ListWithCardsModel
        {
            List = list.ToModel(),
            Cards = list.Cards.Select(c => c.ToShortModel()).ToList(),
        };
    }

    public static List ToEntity(this CreateListModel model)
    {
        return new()
        {
            Name = model.Name,
        };
    }
}