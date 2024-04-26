using TaskBoard.API.Contracts.Requests;
using TaskBoard.API.Mapping;
using TaskBoard.BLL.Services;

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
                error => error.ToResponse());
        });
    }
}