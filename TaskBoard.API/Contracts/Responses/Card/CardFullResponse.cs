namespace TaskBoard.API.Contracts.Responses.Card;

public class CardFullResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public DateTime DueDate { get; set; }

    public string Priority { get; set; } = default!;

    public int ListId { get; set; }

    public string ListName { get; set; } = default!;
}