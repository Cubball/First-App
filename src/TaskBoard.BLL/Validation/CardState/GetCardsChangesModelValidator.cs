using FluentValidation;
using TaskBoard.BLL.Models.CardState;

namespace TaskBoard.BLL.Validation.CardState;

public class GetCardsChangesModelValidator : AbstractValidator<GetCardsChangesModel>
{
    public GetCardsChangesModelValidator()
    {
        RuleFor(m => m.Page)
            .GreaterThan(0);
        RuleFor(m => m.PageSize)
            .GreaterThan(0);
    }
}