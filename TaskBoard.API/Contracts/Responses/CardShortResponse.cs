namespace TaskBoard.API.Contracts.Responses;

public class CardShortResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public DateTime DueDate { get; set; }

    public string Priority { get; set; } = default!;
}