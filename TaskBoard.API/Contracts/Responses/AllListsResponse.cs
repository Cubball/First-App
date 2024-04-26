namespace TaskBoard.API.Contracts.Responses;

public class AllListsResponse
{
    public IEnumerable<ListResponse> Lists { get; set; } = default!;
}