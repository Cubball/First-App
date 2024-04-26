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
    }
}