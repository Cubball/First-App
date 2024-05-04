namespace TaskBoard.DAL.Entities;

public class CardState
{
    public int Id { get; set; }

    public int CardId { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public DateTime DueDate { get; set; }

    public string Priority { get; set; } = default!;

    public int ListId { get; set; } = default!;

    public string ListName { get; set; } = default!;

    public DateTime UpdatedAt { get; set; }

    public bool Deleted { get; set; }

    public int? PreviousStateId { get; set; }

    public CardState? PreviousState { get; set; }
}