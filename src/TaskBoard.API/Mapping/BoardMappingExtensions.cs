using TaskBoard.API.Contracts.Requests.Board;
using TaskBoard.API.Contracts.Responses.Board;
using TaskBoard.BLL.Models.Board;

namespace TaskBoard.API.Mapping;

public static class BoardMappingExtensions
{
    public static BoardResponse ToResponse(this BoardModel model)
    {
        return new()
        {
            Id = model.Id,
            Name = model.Name,
        };
    }

    public static BoardWithListsResponse ToResponse(this BoardWithListsModel model)
    {
        return new()
        {
            Id = model.Board.Id,
            Name = model.Board.Name,
            Lists = model.Lists.Select(l => l.ToResponse()),
        };
    }

    public static CreateBoardModel ToModel(this CreateBoardRequest request)
    {
        return new()
        {
            Name = request.Name,
        };
    }

    public static UpdateBoardModel ToModel(this (int Id, UpdateBoardRequest Request) tuple)
    {
        return new()
        {
            Id = tuple.Id,
            Name = tuple.Request.Name,
        };
    }

    public static AllBoardsResponse ToResponse(this IEnumerable<BoardModel> boards)
    {
        return new()
        {
            Boards = boards.Select(b => b.ToResponse()),
        };
    }
}