namespace TaskBoard.API.Contracts.Responses.History;

public class CardStateResponse
{
    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public DateTime DueDate { get; set; }

    public string Priority { get; set; } = default!;

    public int ListId { get; set; } = default!;

    public string ListName { get; set; } = default!;
}