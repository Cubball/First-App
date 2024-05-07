namespace TaskBoard.API.Contracts.Responses.History;

public class CardsChangesListResponse
{
    public int TotalItems { get; set; }

    public int PageSize { get; set; }

    public int PageNumber { get; set; }

    public IEnumerable<CardChangeResponse> Items { get; set; } = default!;
}