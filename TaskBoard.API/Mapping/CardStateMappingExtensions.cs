using TaskBoard.API.Contracts.Responses.History;
using TaskBoard.BLL.Models.CardState;

namespace TaskBoard.API.Mapping;

public static class CardStateMappingExtensions
{
    public static CardStateResponse ToResponse(this CardStateModel model)
    {
        return new()
        {
            Name = model.Name,
            Description = model.Description,
            DueDate = model.DueDate,
            Priority = model.Priority,
            ListId = model.ListId,
            ListName = model.ListName,
        };
    }

    public static CardChangeResponse ToResponse(this CardChangeModel model)
    {
        return new()
        {
            CardId = model.CardId,
            UpdatedAt = model.UpdatedAt,
            PreviousState = model.PreviousState?.ToResponse(),
            CurrentState = model.CurrentState?.ToResponse(),
        };
    }

    public static CardsChangesListResponse ToResponse(this CardsChangesListModel model)
    {
        return new()
        {
            TotalItems = model.TotalItems,
            PageNumber = model.PageNumber,
            PageSize = model.PageSize,
            Items = model.Items.Select(i => i.ToResponse()),
        };
    }

    public static AllCardChangesResponse ToAllCardChangesResponse(this IEnumerable<CardChangeModel> changeModels)
    {
        return new() { Changes = changeModels.Select(c => c.ToResponse()) };
    }
}