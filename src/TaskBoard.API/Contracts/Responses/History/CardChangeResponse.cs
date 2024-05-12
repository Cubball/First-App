namespace TaskBoard.API.Contracts.Responses.History;

public class CardChangeResponse
{
    public int CardId { get; set; }

    public DateTime UpdatedAt { get; set; }

    public CardStateResponse? PreviousState { get; set; }

    public CardStateResponse? CurrentState { get; set; }
}