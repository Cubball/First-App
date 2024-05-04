namespace TaskBoard.API.Contracts.Responses.Card;

public class AllCardsResponse
{
    public IEnumerable<ListWithCardsResponse> Lists { get; set; } = default!;
}