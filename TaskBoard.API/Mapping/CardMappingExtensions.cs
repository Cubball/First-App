using TaskBoard.API.Contracts.Responses;
using TaskBoard.BLL.Models;

namespace TaskBoard.API.Mapping;

public static class CardMappingExtensions
{
    public static CardShortResponse ToShortResponse(this CardShortModel cardModel)
    {
        return new()
        {
            Id = cardModel.Id,
            Name = cardModel.Name,
            Description = cardModel.Description,
            DueDate = cardModel.DueDate,
            Priority = cardModel.Priority
        };
    }
}