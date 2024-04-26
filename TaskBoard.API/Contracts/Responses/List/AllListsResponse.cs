namespace TaskBoard.API.Contracts.Responses.List;

public class AllListsResponse
{
    public IEnumerable<ListResponse> Lists { get; set; } = default!;
}