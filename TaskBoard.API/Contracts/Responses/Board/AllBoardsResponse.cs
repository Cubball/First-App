namespace TaskBoard.API.Contracts.Responses.Board;

public class AllBoardsResponse
{
    public IEnumerable<BoardResponse> Boards { get; set; } = default!;
}