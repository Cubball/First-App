using TaskBoard.API.Mapping;
using TaskBoard.BLL.Services.Interfaces;

namespace TaskBoard.API.Endpoints;

public static class HistoryEndpoints
{
    public static void MapHistoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/history");
        group.MapGet("", async (IHistoryService historyService, int page = 1, int pageSize = 20) =>
        {
            var result = await historyService.GetCardChangesAsync(new() { Page = page, PageSize = pageSize });
            return result.Match(
                changes => Results.Ok(changes.ToResponse()),
                errors => errors.ToResponse());
        });

        group.MapGet("{id}", async (int id, IHistoryService historyService) =>
        {
            var result = await historyService.GetAllChangesByCardIdAsync(id);
            return Results.Ok(result.ToAllCardChangesResponse());
        });
    }
}