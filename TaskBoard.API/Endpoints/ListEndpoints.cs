using TaskBoard.API.Contracts.Requests.List;
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

        group.MapGet("{id}", async (int id, IListService listService) =>
        {
            var result = await listService.GetListByIdAsync(id);
            return result.Match(
                list => Results.Ok(list.ToResponse()),
                errors => errors.ToResponse());
        });

        group.MapPost("", async (CreateListRequest request, IListService listService) =>
        {
            var result = await listService.CreateListAsync(request.ToModel());
            return result.Match(
                list => Results.Created($"/lists/{list.Id}", list.ToResponse()),
                errors => errors.ToResponse());
        });

        group.MapPut("{id}", async (int id, UpdateListRequest request, IListService listService) =>
        {
            var model = (id, request).ToModel();
            var result = await listService.UpdateListAsync(model);
            return result.Match(
                _ => Results.NoContent(),
                errors => errors.ToResponse());
        });
    }
}