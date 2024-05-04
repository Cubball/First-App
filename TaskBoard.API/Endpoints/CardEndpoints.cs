using TaskBoard.API.Contracts.Requests.Card;
using TaskBoard.API.Mapping;
using TaskBoard.BLL.Services.Interfaces;

namespace TaskBoard.API.Endpoints;

public static class CardEndpoints
{
    public static void MapCardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/cards");
        group.MapGet("", async (ICardService cardService) =>
        {
            var result = await cardService.GetAllCardsAsync();
            var response = result.ToAllCardsResponse();
            return Results.Ok(response);
        });

        group.MapGet("{id}", async (int id, ICardService cardService) =>
        {
            var result = await cardService.GetCardByIdAsync(id);
            return result.Match(
                card => Results.Ok(card.ToFullResponse()),
                errors => errors.ToResponse());
        });

        group.MapPost("", async (CreateCardRequest request, ICardService cardService) =>
        {
            var result = await cardService.CreateCardAsync(request.ToModel());
            return result.Match(
                card => Results.Created($"/cards/{card.Id}", card),
                errors => errors.ToResponse());
        });

        group.MapPut("{id}", async (int id, UpdateCardRequest request, ICardService cardService) =>
        {
            var model = (id, request).ToModel();
            var result = await cardService.UpdateCardAsync(model);
            return result.Match(
                _ => Results.NoContent(),
                errors => errors.ToResponse());
        });

        group.MapDelete("{id}", async (int id, ICardService cardService) =>
        {
            var result = await cardService.DeleteCardByIdAsync(id);
            return result.Match(
                _ => Results.NoContent(),
                errors => errors.ToResponse());
        });
    }
}