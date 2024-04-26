using TaskBoard.BLL.Models.CardState;
using TaskBoard.DAL.Entities;

namespace TaskBoard.BLL.Mapping;

public static class CardStateMappingExtensions
{
    public static CardStateModel ToModel(this CardState cardState)
    {
        return new()
        {
            Name = cardState.Name,
            Description = cardState.Description,
            DueDate = cardState.DueDate,
            Priority = cardState.Priority,
            ListName = cardState.ListName,
        };
    }

    public static CardChangeModel ToChangeModel(this CardState cardState)
    {
        return new()
        {
            CardId = cardState.CardId,
            UpdatedAt = cardState.UpdatedAt,
            PreviousState = cardState.PreviousState?.ToModel(),
            CurrentState = cardState.Deleted ? null : cardState.ToModel(),
        };
    }
}