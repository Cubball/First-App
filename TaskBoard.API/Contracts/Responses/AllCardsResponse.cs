namespace TaskBoard.API.Contracts.Responses;

public class AllCardsResponse
{
    public IEnumerable<ListWithCardsResponse> Lists { get; set; } = default!;
}