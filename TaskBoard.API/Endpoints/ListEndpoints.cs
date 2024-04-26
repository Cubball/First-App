using TaskBoard.API.Mapping;
using TaskBoard.BLL.Services;

namespace TaskBoard.API.Endpoints;

public static class ListEndpoints
{
    public static void MapListEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/lists");
        group.MapGet("", async (IListService listService) =>
        {
            var result = await listService.GetAllListsAsync();
            var response = result.ToAllListsResponse();
            return Results.Ok(response);
        });
    }
}