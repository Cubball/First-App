using FluentValidation;
using TaskBoard.BLL.Models.Card;
using TaskBoard.BLL.Validation.Common;

namespace TaskBoard.BLL.Validation.Card;

public class UpdateCardModelValidator : AbstractValidator<UpdateCardModel>
{
    public UpdateCardModelValidator()
    {
        RuleFor(c => c.Name)
            .NotNull()
            .NotEmpty()
            .Length(2, 100);
        RuleFor(c => c.Description)
            .NotNull()
            .MaximumLength(1000);
        RuleFor(c => c.DueDate)
            .UtcKind();
        RuleFor(c => c.Priority)
            .ValidPriority();
    }
}