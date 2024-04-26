namespace TaskBoard.API.Contracts.Responses;

public class ListWithCardsResponse
{
    public int Id { get; set; } = default!;

    public string Name { get; set; } = default!;

    public IEnumerable<CardShortResponse> Cards { get; set; } = default!;
}