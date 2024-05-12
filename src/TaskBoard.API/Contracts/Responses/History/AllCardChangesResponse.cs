namespace TaskBoard.API.Contracts.Responses.History;

public class AllCardChangesResponse
{
    public IEnumerable<CardChangeResponse> Changes { get; set; } = default!;
}