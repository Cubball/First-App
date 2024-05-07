using TaskBoard.BLL.Models.Board;
using TaskBoard.DAL.Entities;

namespace TaskBoard.BLL.Mapping;

public static class BoardMappingExtensions
{
    public static Board ToEntity(this CreateBoardModel model)
    {
        return new()
        {
            Name = model.Name,
        };
    }

    public static BoardModel ToModel(this Board board)
    {
        return new()
        {
            Id = board.Id,
            Name = board.Name,
        };
    }

    public static BoardWithListsModel ToModelWithLists(this Board board)
    {
        return new()
        {
            Board = board.ToModel(),
            Lists = board.Lists.Select(l => l.ToModelWithCards()).ToList(),
        };
    }
}