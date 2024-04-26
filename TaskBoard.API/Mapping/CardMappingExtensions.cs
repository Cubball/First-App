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

    public static CardFullResponse ToFullResponse(this CardFullModel cardModel)
    {
        return new()
        {
            Id = cardModel.Id,
            Name = cardModel.Name,
            Description = cardModel.Description,
            DueDate = cardModel.DueDate,
            Priority = cardModel.Priority,
            ListId = cardModel.List.Id,
            ListName = cardModel.List.Name,
        };
    }
}