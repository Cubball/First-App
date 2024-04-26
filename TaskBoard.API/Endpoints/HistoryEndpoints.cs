using TaskBoard.API.Mapping;
using TaskBoard.BLL.Services;

namespace TaskBoard.API.Endpoints;

public static class HistoryEndpoints
{
    public static void MapHistoryEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/history", async (IHistoryService historyService, int page = 1, int pageSize = 20) =>
        {
            var result = await historyService.GetCardChangesAsync(new() { Page = page, PageSize = pageSize });
            return result.Match(
                changes => Results.Ok(changes.ToResponse()),
                errors => errors.ToResponse());
        });
    }
}