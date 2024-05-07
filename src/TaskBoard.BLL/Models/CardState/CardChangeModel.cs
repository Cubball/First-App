namespace TaskBoard.BLL.Models.CardState;

public class CardChangeModel
{
    public int CardId { get; set; }

    public DateTime UpdatedAt { get; set; }

    public CardStateModel? PreviousState { get; set; }

    public CardStateModel? CurrentState { get; set; }
}