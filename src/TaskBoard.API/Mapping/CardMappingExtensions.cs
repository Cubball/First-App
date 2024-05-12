using TaskBoard.API.Contracts.Requests.Card;
using TaskBoard.API.Contracts.Responses.Card;
using TaskBoard.BLL.Models.Card;

namespace TaskBoard.API.Mapping;

public static class CardMappingExtensions
{
    public static CardShortResponse ToResponse(this CardShortModel cardModel)
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

    public static CardFullResponse ToResponse(this CardFullModel cardModel)
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

    public static CreateCardModel ToModel(this CreateCardRequest request)
    {
        return new()
        {
            Name = request.Name,
            Description = request.Description,
            DueDate = request.DueDate,
            Priority = request.Priority,
            ListId = request.ListId
        };
    }

    public static UpdateCardModel ToModel(this (int Id, UpdateCardRequest Request) tuple)
    {
        return new()
        {
            Id = tuple.Id,
            Name = tuple.Request.Name,
            Description = tuple.Request.Description,
            DueDate = tuple.Request.DueDate,
            Priority = tuple.Request.Priority,
            ListId = tuple.Request.ListId
        };
    }
}