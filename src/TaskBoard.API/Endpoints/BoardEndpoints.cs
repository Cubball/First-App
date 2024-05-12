using TaskBoard.API.Contracts.Requests.Board;
using TaskBoard.API.Mapping;
using TaskBoard.BLL.Services.Interfaces;

namespace TaskBoard.API.Endpoints;

public static class BoardEndpoints
{
    public static void MapBoardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/boards");
        group.MapGet("", async (IBoardService boardService) =>
        {
            var result = await boardService.GetAllBoardsAsync();
            return Results.Ok(result.ToResponse());
        });

        group.MapGet("{id}", async (int id, IBoardService boardService) =>
        {
            var result = await boardService.GetBoardWithListsAndCardsByIdAsync(id);
            return result.Match(
                board => Results.Ok(board.ToResponse()),
                errors => errors.ToResponse());
        });

        group.MapGet("{id}/history", async (int id, IHistoryService historyService, int page = 1, int pageSize = 20) =>
        {
            var result = await historyService.GetCardChangesAsync(new()
            {
                BoardId = id,
                Page = page,
                PageSize = pageSize,
            });
            return result.Match(
                changes => Results.Ok(changes.ToResponse()),
                errors => errors.ToResponse());
        });

        group.MapGet("{id}/lists", async (int id, IListService listService) =>
        {
            var result = await listService.GetAllListsByBoardIdAsync(id);
            return Results.Ok(result.ToResponse());
        });

        group.MapPost("", async (CreateBoardRequest request, IBoardService boardService) =>
        {
            var result = await boardService.CreateBoardAsync(request.ToModel());
            return result.Match(
                board => Results.Created($"/boards/{board.Id}", board.ToResponse()),
                errors => errors.ToResponse());
        });

        group.MapPut("{id}", async (int id, UpdateBoardRequest request, IBoardService boardService) =>
        {
            var model = (id, request).ToModel();
            var result = await boardService.UpdateBoardAsync(model);
            return result.Match(
                _ => Results.NoContent(),
                errors => errors.ToResponse());
        });

        group.MapDelete("{id}", async (int id, IBoardService boardService) =>
        {
            var result = await boardService.DeleteBoardByIdAsync(id);
            return result.Match(
                _ => Results.NoContent(),
                errors => errors.ToResponse());
        });
    }
}