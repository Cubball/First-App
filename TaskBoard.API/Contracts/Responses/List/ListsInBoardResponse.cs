namespace TaskBoard.API.Contracts.Responses.List;

public class ListsInBoardResponse
{
    public IEnumerable<ListResponse> Lists { get; set; } = default!;
}