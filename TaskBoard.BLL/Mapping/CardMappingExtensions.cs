using TaskBoard.BLL.Models.Card;
using TaskBoard.DAL.Entities;

namespace TaskBoard.BLL.Mapping;

public static class CardMappingExtensions
{
    public static Card ToEntity(this CreateCardModel model)
    {
        return new Card
        {
            Name = model.Name,
            Description = model.Description,
            DueDate = model.DueDate,
            Priority = model.Priority,
            ListId = model.ListId,
        };
    }

    public static CardShortModel ToShortModel(this Card card)
    {
        return new CardShortModel
        {
            Id = card.Id,
            Name = card.Name,
            Description = card.Description,
            DueDate = card.DueDate,
            Priority = card.Priority,
        };
    }

    public static CardFullModel ToFullModel(this Card card)
    {
        return new CardFullModel
        {
            Id = card.Id,
            Name = card.Name,
            Description = card.Description,
            DueDate = card.DueDate,
            Priority = card.Priority,
            List = card.List.ToModel(),
        };
    }
}