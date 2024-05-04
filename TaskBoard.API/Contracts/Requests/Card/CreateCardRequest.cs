namespace TaskBoard.API.Contracts.Requests.Card;

public class CreateCardRequest
{
    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public DateTime DueDate { get; set; }

    public string Priority { get; set; } = default!;

    public int ListId { get; set; }
}