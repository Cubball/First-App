namespace TaskBoard.API.Contracts.Requests.List;

public class CreateListRequest
{
    public string Name { get; set; } = default!;

    public int BoardId { get; set; }
}