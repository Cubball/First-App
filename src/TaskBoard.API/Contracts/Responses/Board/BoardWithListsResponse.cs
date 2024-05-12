using TaskBoard.API.Contracts.Responses.List;

namespace TaskBoard.API.Contracts.Responses.Board;

public class BoardWithListsResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public IEnumerable<ListWithCardsResponse> Lists { get; set; } = default!;
}